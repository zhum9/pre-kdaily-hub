// Education decisions are independent of the legacy reward and check-in system.
export const TEMPLATE_IDS = [
  "count",
  "compare",
  "compose",
  "add",
  "subtract",
  "story",
  "missing",
  "tens",
  "carry",
  "borrow",
  "shape3d",
  "shape2d",
  "pattern",
  "rank",
  "enumerate",
  "paths",
  "balance",
  "english",
];
export const SUBJECTS = ["math", "english", "thinking"];
export const DEFAULT_PROFILE = {
  grade: 1,
  term: 1,
  publisher: "江苏凤凰教育出版社",
  edition: "待核对版次",
  schoolSkill: "m-add10",
  englishStage: "启蒙，尚未开课",
  preview: false,
  dailyMinutes: 20,
  autoReadQuestions: true,
};
export function localDay(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
export function dayDistance(a, b) {
  return Math.round(
    (Date.parse(b + "T00:00:00+08:00") - Date.parse(a + "T00:00:00+08:00")) /
      86400000,
  );
}
export function hash(text) {
  let n = 2166136261;
  for (const ch of String(text)) {
    n ^= ch.codePointAt(0);
    n = Math.imul(n, 16777619);
  }
  return n >>> 0;
}
export function random(seed) {
  let n = hash(seed);
  return () => {
    n += 0x6d2b79f5;
    let t = Math.imul(n ^ (n >>> 15), 1 | n);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function shuffled(values, rng) {
  const out = [...values];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
export function validateCatalog(catalog) {
  if (
    !catalog ||
    catalog.schemaVersion !== 1 ||
    typeof catalog.version !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(catalog.checkedAt) ||
    !Array.isArray(catalog.sources) ||
    !Array.isArray(catalog.skills) ||
    !catalog.skills.length ||
    catalog.skills.length > 300
  )
    throw Error("内容包格式或版本不支持");
  const sourceIds = new Set(catalog.sources.map((s) => s.id));
  for (const s of catalog.sources)
    if (!s.id || !s.title || !/^https:\/\//.test(s.url))
      throw Error("来源信息不完整");
  const ids = new Set();
  for (const s of catalog.skills) {
    if (
      !/^[a-z][a-z0-9-]{1,60}$/.test(s.id) ||
      ids.has(s.id) ||
      !SUBJECTS.includes(s.subject) ||
      !TEMPLATE_IDS.includes(s.template) ||
      !Number.isInteger(s.order) ||
      ![1, 2].includes(s.term) ||
      typeof s.title !== "string" ||
      typeof s.goal !== "string" ||
      typeof s.coach !== "string" ||
      !Array.isArray(s.prerequisites) ||
      !Array.isArray(s.sources) ||
      !s.sources.length ||
      s.sources.some((id) => !sourceIds.has(id))
    )
      throw Error("知识点、题型或来源不合法：" + s.id);
    if (
      s.template === "english" &&
      (!Array.isArray(s.words) ||
        s.words.length < 3 ||
        s.words.length > 12 ||
        s.words.some((w) => !w.en || !w.zh || !w.picture) ||
        new Set(s.words.map((w) => w.en)).size !== s.words.length ||
        !Array.isArray(s.dialogue) ||
        !s.dialogue.length ||
        !s.activity)
    )
      throw Error("英语活动不完整");
    if (
      s.max !== undefined &&
      (!Number.isInteger(s.max) || s.max < 5 || s.max > 100)
    )
      throw Error("数值范围不合法");
    ids.add(s.id);
  }
  const visiting = new Set(),
    visited = new Set();
  function visit(id) {
    if (visiting.has(id)) throw Error("知识点存在循环依赖");
    if (visited.has(id)) return;
    const s = catalog.skills.find((s) => s.id === id);
    if (!s) throw Error("前置知识点不存在：" + id);
    visiting.add(id);
    s.prerequisites.forEach(visit);
    visiting.delete(id);
    visited.add(id);
  }
  catalog.skills.forEach((s) => visit(s.id));
  return catalog;
}
export function mastery(skillId, attempts = [], today = localDay()) {
  // Repeating a previously seen problem, hints and parent-supported work cannot inflate mastery.
  const unique = new Map();
  for (const a of attempts
    .filter((a) => a.skillId === skillId && a.day <= today)
    .sort((a, b) => a.at.localeCompare(b.at))) {
    unique.delete(a.itemId);
    unique.set(a.itemId, a);
  }
  const recent = [...unique.values()].slice(-12),
    independent = recent.filter(
      (a) => !a.hintUsed && !a.supported && a.kind !== "speaking",
    );
  const correct = independent.filter((a) => a.correct),
    days = new Set(correct.map((a) => a.day));
  const rate = independent.length ? correct.length / independent.length : 0;
  const explained = correct.some((a) => a.explained),
    transfer = correct.some((a) => a.transfer);
  const secure =
    independent.length >= 6 &&
    rate >= 0.8 &&
    days.size >= 2 &&
    explained &&
    transfer;
  const last = recent.at(-1)?.day;
  return {
    status: secure ? "secure" : recent.length ? "practising" : "new",
    independent: independent.length,
    correct: correct.length,
    rate,
    days: days.size,
    explained,
    transfer,
    due: !!last && dayDistance(last, today) >= (secure ? 7 : 1),
    last,
  };
}
export function availability(skill, catalog, state) {
  const term = Number(state.profile.term),
    school = catalog.skills.find((s) => s.id === state.profile.schoolSkill);
  if (skill.term <= term) {
    // Thinking and English have their own prerequisite chains, independent of the maths textbook.
    if (skill.subject === "math" && school && skill.order > school.order)
      return { allowed: false, reason: "尚未到课堂进度，可在家长设置中调整" };
    return {
      allowed: true,
      preview: false,
      suggestedSupport: skill.prerequisites.some(
        (id) => mastery(id, state.attempts).status !== "secure",
      ),
    };
  }
  if (!state.profile.preview)
    return { allowed: false, reason: "下学期预习由家长开启" };
  if (
    skill.prerequisites.some(
      (id) => mastery(id, state.attempts).status !== "secure",
    )
  )
    return { allowed: false, reason: "先掌握前置知识点，再尝试这一步" };
  return { allowed: true, preview: true };
}
export function plan(subject, catalog, state, today = localDay()) {
  const eligible = catalog.skills
    .filter(
      (s) => s.subject === subject && availability(s, catalog, state).allowed,
    )
    .sort((a, b) => a.order - b.order);
  const due = eligible.filter((s) => mastery(s.id, state.attempts, today).due);
  const current =
    eligible.find(
      (s) => mastery(s.id, state.attempts, today).status !== "secure",
    ) || eligible[0];
  const school = eligible.find((s) => s.id === state.profile.schoolSkill);
  const target =
    subject === "math" &&
    school &&
    mastery(school.id, state.attempts, today).status !== "secure"
      ? school
      : current;
  const preview = eligible.find((s) => availability(s, catalog, state).preview);
  const foundation = target?.prerequisites
    .map((id) => eligible.find((s) => s.id === id))
    .find((s) => s && mastery(s.id, state.attempts, today).status !== "secure");
  const selected = [
    ...new Map(
      [
        ...due.slice(0, 1),
        target,
        ...(foundation ? [foundation] : []),
        ...(preview ? [preview] : []),
      ]
        .filter(Boolean)
        .map((s) => [s.id, s]),
    ).values(),
  ];
  return {
    subject,
    selected,
    reason: due.length
      ? "先复习到期知识，再练课堂内容"
      : "从当前水平开始，做会一小步",
    today,
  };
}
export function makeItem(skill, seed, index = 0) {
  const rng = random(`${seed}:${skill.id}:${index}`),
    int = (a, b) => a + Math.floor(rng() * (b - a + 1));
  const max = skill.max || 10;
  let a,
    b,
    answer,
    prompt,
    visual = "",
    hint,
    explanation,
    choices,
    listen,
    transfer = false,
    kind = "number";
  switch (skill.template) {
    case "count":
      a = int(0, max);
      answer = a;
      visual = a ? "● ".repeat(a).trim() : "盒子里没有圆点";
      prompt = "数一数，一共有多少个圆点？";
      hint = "用手指一个一个点着数，每个圆点只数一次。一个也没有时，用0表示。";
      explanation = a
        ? `最后数到 ${a}，所以一共有 ${a} 个。`
        : "一个圆点也没有，用0表示。";
      break;
    case "compare":
      a = int(1, max - 1);
      b = int(a + 1, max);
      answer = Math.max(a, b);
      prompt = `${a} 和 ${b}，哪个数大？`;
      visual = `${"● ".repeat(a)}\n${"● ".repeat(b)}`;
      hint = "把两排圆点一一配对，哪一排有剩下？";
      explanation = `${b} 比 ${a} 多 ${b - a}，所以 ${b} 大。`;
      break;
    case "compose":
      a = int(3, max);
      b = int(1, a - 1);
      answer = a - b;
      prompt = `${a} 可以分成 ${b} 和几？`;
      visual = `一共 ${a} 个，左边 ${b} 个，右边 □ 个`;
      hint = "摆出总数，再拿走已经知道的一部分。";
      explanation = `${b} + ${answer} = ${a}，两部分合起来等于总数。`;
      transfer = true;
      break;
    case "add":
      a = int(1, max - 1);
      b = int(1, max - a);
      answer = a + b;
      prompt = `${a} + ${b} = □`;
      visual = `${"● ".repeat(a)} + ${"● ".repeat(b)}`;
      hint = "把两部分放到一起，或从较大的数接着数。";
      explanation = `从 ${a} 接着数 ${b} 个，得到 ${answer}。`;
      break;
    case "subtract":
      a = int(2, max);
      b = int(1, a);
      answer = a - b;
      prompt = `${a} − ${b} = □`;
      visual = `一共 ${a} 个，拿走 ${b} 个`;
      hint = "摆出总数，拿走一部分，看看剩下多少。";
      explanation = `${a} 拿走 ${b}，剩下 ${answer}；${answer} + ${b} = ${a}。`;
      break;
    case "story":
      a = int(2, Math.min(max - 1, 9));
      b = int(1, max - a);
      answer = a + b;
      prompt = `盒里有 ${a} 支铅笔，又放进 ${b} 支。现在一共有多少支？`;
      hint = "“又放进”让铅笔增加了，画出两部分再合起来。";
      explanation = `原来 ${a} 支和新放进的 ${b} 支合起来：${a} + ${b} = ${answer}（支）。`;
      transfer = true;
      break;
    case "missing":
      a = int(2, max);
      b = int(1, a - 1);
      answer = a - b;
      prompt = `□ + ${b} = ${a}，盒子里藏着几？`;
      hint = "总数减去已经知道的部分，就是藏起来的部分。";
      explanation = `${answer} + ${b} = ${a}，也可以用 ${a} − ${b} = ${answer} 检查。`;
      transfer = true;
      break;
    case "tens":
      a = int(11, max);
      answer = a % 10;
      prompt = `${a} 里面有 ${Math.floor(a / 10)} 个十和几个一？`;
      visual = `${Math.floor(a / 10)} 捆小棒（每捆10根） + □ 根`;
      hint = "先按10个一组捆起来，再看剩下几个一。";
      explanation = `${a} = ${Math.floor(a / 10) * 10} + ${answer}，所以有 ${answer} 个一。`;
      transfer = true;
      break;
    case "carry":
      a = int(6, 9);
      b = int(11 - a, 9);
      answer = a + b;
      prompt = `${a} + ${b} = □`;
      hint = `${a} 还差 ${10 - a} 凑成10，把另一个加数分一分。`;
      explanation = `把 ${b} 分成 ${10 - a} 和 ${b - (10 - a)}；${a} + ${10 - a} = 10，10 + ${b - (10 - a)} = ${answer}。`;
      transfer = index % 2 === 0;
      break;
    case "borrow":
      a = int(11, 18);
      b = int(a - 9, 9);
      answer = a - b;
      prompt = `${a} − ${b} = □`;
      hint = "可以从10里减，再把剩下的一部分合起来，也可以想加法。";
      explanation = `${a} 分成10和 ${a - 10}；10 − ${b} = ${10 - b}，${10 - b} + ${a - 10} = ${answer}。`;
      transfer = index % 2 === 0;
      break;
    case "shape3d": {
      const shapes = [
        ["球", "⚽", "各个方向看起来都圆圆的，可以向不同方向滚动"],
        ["正方体", "🎲", "有6个同样大的正方形面"],
        ["圆柱", "🥫", "上下面是同样大的圆，侧面是曲面"],
      ];
      const s = shapes[int(0, 2)];
      answer = s[0];
      prompt = `${s[2]}。它是哪一种立体图形？`;
      visual = s[1];
      choices = shapes.map((s) => s[0]);
      hint = "观察真实物品的面，试一试能不能滚动。";
      explanation = `这是${s[0]}。在家中再找一个相似的物品。`;
      kind = "choice";
      transfer = true;
      break;
    }
    case "shape2d": {
      const shapes = [
        ["三角形", "△", "3条边、3个角"],
        ["正方形", "□", "4条一样长的边、4个直角"],
        ["圆", "○", "弯弯的边，没有角"],
      ];
      const s = shapes[int(0, 2)];
      answer = s[0];
      prompt = `有${s[2]}的平面图形叫什么？`;
      visual = s[1];
      choices = shapes.map((s) => s[0]);
      hint = "沿着图形的边描一遍，再数一数角。";
      explanation = `这是${s[0]}。用纸片摆一摆、描一描。`;
      kind = "choice";
      transfer = true;
      break;
    }
    case "pattern": {
      const units = [
        ["🔵", "🟡"],
        ["🔺", "🔺", "🔵"],
        ["🌸", "🍀", "🍀"],
      ];
      const u = units[int(0, units.length - 1)],
        n = int(5, 9);
      visual = Array.from({ length: n }, (_, i) => u[i % u.length]).join(" ");
      answer = u[n % u.length];
      prompt = "按同一组图案不断重复，下一个是什么？";
      choices = [...new Set(u)];
      hint = "先圈出一组最小的重复图案，再一组一组读。";
      explanation = `重复的一组是 ${u.join(" ")}，所以下一个是 ${answer}。`;
      kind = "choice";
      transfer = true;
      break;
    }
    case "rank": {
      const names = shuffled(["小兔", "小熊", "小猫"], rng);
      answer = names[0];
      prompt = `从前往后排队：${names[0]}在${names[1]}前面，${names[1]}在${names[2]}前面。谁排第一？`;
      choices = shuffled(names, rng);
      hint = "把每个角色画成一张卡，按照两条线索排起来。";
      explanation = `从前到后是：${names.join(" → ")}，所以${answer}第一。`;
      kind = "choice";
      transfer = true;
      break;
    }
    case "enumerate":
      a = int(2, 4);
      b = int(2, 3);
      answer = a * b;
      prompt = `有 ${a} 种不同上衣、${b} 种不同裤子。每次各选一件，有多少种搭配？`;
      visual = `上衣 ${Array.from({ length: a }, (_, i) => String.fromCharCode(65 + i)).join("、")}；裤子 ${Array.from({ length: b }, (_, i) => i + 1).join("、")}`;
      hint = "先固定上衣A，配完每一条裤子，再换上衣B，避免重复遗漏。";
      explanation = `每件上衣有 ${b} 种搭配，一共 ${Array(a).fill(b).join(" + ")} = ${answer} 种。可以画连线核对。`;
      transfer = true;
      break;
    case "paths":
      a = int(2, 4);
      answer = a;
      prompt = `小兔从家到树屋只能走图中的路线：先走到一个花坛，再从这个花坛走到树屋，途中不回头。有几条不同路线？`;
      visual = Array.from(
        { length: a },
        (_, i) => `家 → 花坛${i + 1} → 树屋`,
      ).join("\n");
      hint = "给每条路线标一个号码。这里只数图中列出的路线。";
      explanation = `每个花坛对应一条不同路线，共 ${a} 条。`;
      transfer = true;
      break;
    case "balance":
      a = int(2, 5);
      b = int(2, 3);
      answer = b;
      prompt = `天平两边一样重：左边 ${b} 个同样重的积木，右边 ${a * b} 颗同样重的珠子。1个积木相当于 ${a} 颗珠子。左边有几个积木？`;
      hint = "把右边的珠子按每组的颗数圈起来，一组对应一个积木。";
      explanation = `${a * b} 颗珠子分成每组 ${a} 颗，正好 ${b} 组，所以有 ${b} 个积木。`;
      transfer = true;
      break;
    case "english": {
      const w = skill.words[int(0, skill.words.length - 1)];
      answer = w.en;
      listen = index % 2 === 0 ? w.en : w.cue;
      transfer = index % 2 !== 0;
      prompt = "先听一听，再选择你听到的图片。";
      choices = shuffled(skill.words, rng).slice(0, 3);
      if (!choices.some((c) => c.en === w.en)) choices[0] = w;
      choices = shuffled(choices, rng);
      hint = `这个词表示“${w.zh}”。可以先看实物，再听一遍。`;
      explanation = `${w.en} 表示“${w.zh}”。把这个词放进今天的小对话里试试。`;
      kind = "listening";
      break;
    }
    default:
      throw Error("Unsupported template");
  }
  if (skill.template === "count" && index % 2) {
    prompt = "这里一共有多少颗星星？换种摆法也数数看。";
    visual = answer
      ? Array.from(
          { length: answer },
          (_, i) => (i && i % 3 === 0 ? "\n" : "") + "★",
        ).join(" ")
      : "盒子里没有星星";
    transfer = true;
  }
  if (skill.template === "compare" && index % 2) {
    prompt = `小兔有 ${a} 根胡萝卜，小熊有 ${b} 根。较多的那一份有几根？`;
    transfer = true;
  }
  if (skill.template === "add" && index % 3 === 2) {
    prompt = `小兔先找到 ${a} 枚果实，又找到 ${b} 枚。合起来有多少枚？`;
    transfer = true;
  }
  if (skill.template === "subtract" && index % 3 === 2) {
    prompt = `盘子里有 ${a} 块饼干，吃掉 ${b} 块，还剩多少块？`;
    transfer = true;
  }
  if (skill.template === "balance")
    prompt = `天平两边一样重：左边是数量未知的积木，右边有 ${a * b} 颗珠子。每个积木同样重，每颗珠子同样重，1个积木相当于 ${a} 颗珠子。左边有几个积木？`;
  if (skill.template === "shape3d" && index % 2)
    prompt = "看图，想一想这种物体接近哪一种立体图形？";
  if (skill.template === "shape2d" && index % 2)
    prompt = "看这个图形，它叫什么？";
  if (skill.template === "paths") {
    const flowers = shuffled(
      ["玫瑰花坛", "月季花坛", "向日葵花坛", "郁金香花坛", "茉莉花坛"],
      rng,
    ).slice(0, a);
    visual = flowers.map((name) => `家 → ${name} → 树屋`).join("\n");
  }
  const identity = JSON.stringify({ prompt, visual, listen, answer });
  return {
    id: `${skill.id}:${hash(identity).toString(36)}`,
    skillId: skill.id,
    catalogVersion: skill.catalogVersion,
    prompt,
    visual,
    answer,
    choices: choices
      ? typeof choices[0] === "object"
        ? choices
        : shuffled(choices, rng)
      : undefined,
    listen,
    hint,
    explanation,
    transfer,
    kind,
  };
}
export function makeSession(
  subject,
  catalog,
  state,
  day = localDay(),
  preferredId,
) {
  const route = plan(subject, catalog, state, day),
    preferred = catalog.skills.find(
      (s) => s.id === preferredId && s.subject === subject,
    );
  const selected =
    preferred && availability(preferred, catalog, state).allowed
      ? [preferred]
      : route.selected;
  const count = subject === "math" ? 6 : subject === "english" ? 4 : 3,
    items = [],
    seen = new Set(
      state.attempts.filter((a) => a.day === day).map((a) => a.itemId),
    );
  const serial = Object.values(state.sessions).filter(
    (s) => s.subject === subject && s.day === day,
  ).length;
  for (let i = 0; i < 1000 && items.length < count && selected.length; i++) {
    const skill = selected[i % selected.length],
      item = makeItem(
        { ...skill, catalogVersion: catalog.version },
        `${day}:${serial}`,
        i,
      );
    if (!seen.has(item.id)) {
      seen.add(item.id);
      items.push(item);
    }
  }
  return {
    id: `${day}:${subject}:${serial}:${preferredId || "plan"}`,
    subject,
    day,
    items,
    answers: {},
    finished: false,
    catalogVersion: catalog.version,
  };
}
export function isCorrect(item, value) {
  return item.kind === "number"
    ? String(value).trim() !== "" &&
        /^\d+$/.test(String(value).trim()) &&
        Number(value) === item.answer
    : value === item.answer;
}
