// Original, bounded early-primary enrichment problems. Each level changes the
// reasoning structure. Models are retained for independent answer verification.
export const THINKING_TEMPLATES = [
  "interval",
  "redistribute",
  "sumdiff",
  "replacement",
  "restricted-enumeration",
  "grid-routes",
  "logic-matching",
];
const range = (n) => Array.from({ length: n }, (_, i) => i);
const total = (values) => values.reduce((a, b) => a + b, 0);
const truthCases = [];
for (let a = 0; a < 6; a++)
  for (let b = 0; b < 6; b++)
    for (let c = 0; c < 6; c++)
      if (new Set([a, b, c]).size === 3) {
        const statements = [a, b, c].map((code) => ({
          owner: Math.floor(code / 2),
          equal: code % 2 === 0,
        }));
        for (const trueCount of [1, 2])
          if (
            range(3).filter(
              (owner) =>
                statements.filter((s) => (owner === s.owner) === s.equal)
                  .length === trueCount,
            ).length === 1
          )
            truthCases.push({ statements, trueCount });
      }
function problem(prompt, answer, hint, steps, model, extra = {}) {
  return {
    prompt,
    answer,
    hint,
    steps,
    explanation: steps.join("。") + "。",
    model,
    visual: "",
    kind: "number",
    transfer: true,
    ...extra,
  };
}
function shuffle(values, rng) {
  return values
    .map((v) => ({ v, key: rng() }))
    .sort((a, b) => a.key - b.key)
    .map((x) => x.v);
}
function routes(columns, rows, blocked, via) {
  const visit = (x, y, passed) => {
    if (blocked && blocked.x === x && blocked.y === y) return 0;
    passed = passed || !via || (via.x === x && via.y === y);
    if (x === columns && y === rows) return passed ? 1 : 0;
    return (
      (x < columns ? visit(x + 1, y, passed) : 0) +
      (y < rows ? visit(x, y + 1, passed) : 0)
    );
  };
  return visit(0, 0, false);
}
export function makeThinkingItem(skill, rng, index = 0) {
  if (!THINKING_TEMPLATES.includes(skill.template)) return null;
  const level = skill.level || 1,
    int = (a, b) => a + Math.floor(rng() * (b - a + 1));
  switch (skill.template) {
    case "interval": {
      const spacing = int(1, 3),
        gaps = int(2, 6);
      if (level === 1) {
        if (index % 2) {
          const trees = gaps + 1;
          return problem(
            `一排有 ${trees} 棵树，相邻两棵树相距 ${spacing} 米。从第一棵到最后一棵，一共长多少米？`,
            gaps * spacing,
            "画树，再数树与树之间的空当。树的棵数和空当的个数一样吗？",
            [
              `${trees} 棵树之间只有 ${gaps} 个间隔`,
              `每个间隔 ${spacing} 米，把 ${gaps} 个 ${spacing} 相加，得到 ${gaps * spacing} 米`,
            ],
            {
              type: "interval",
              gaps,
              spacing,
              endpoints: 2,
              ask: "length",
              trees,
            },
          );
        }
        return problem(
          `一条小路长 ${gaps * spacing} 米，每隔 ${spacing} 米放一面旗，两端都放。一共需要多少面旗？`,
          gaps + 1,
          "先按间距分段，再看看两端各在哪里。",
          [
            `小路分成 ${gaps} 个间隔`,
            `两端都放，旗比间隔多1面，所以是 ${gaps} + 1 = ${gaps + 1} 面`,
          ],
          { type: "interval", gaps, spacing, endpoints: 2, ask: "flags" },
        );
      }
      if (level === 2) {
        const mode = int(0, 2),
          endpoints = mode === 0 ? 0 : mode === 1 ? 1 : 0,
          closed = mode === 2,
          answer = closed ? gaps : gaps - 1 + endpoints;
        const prompt = closed
          ? `圆形花坛一圈长 ${gaps * spacing} 米，每隔 ${spacing} 米放一盆花。绕一圈回到原处，原处不重复放。一共放几盆？`
          : `小路长 ${gaps * spacing} 米，每隔 ${spacing} 米放一面旗。${endpoints === 0 ? "两端都不放" : "只在起点放，终点不放"}，一共放几面？`;
        return problem(
          prompt,
          answer,
          "先画一条线或一个圈，把能放、不能放的位置标清楚。",
          [
            `先分出 ${gaps} 个等长间隔`,
            closed
              ? "首尾连在一起，每个间隔对应1盆花，回到起点不再添一盆"
              : endpoints === 0
                ? "两端都不放，比间隔少1面旗"
                : "只放一个端点，旗的面数与间隔相同",
            `因此一共 ${answer} ${closed ? "盆" : "面"}`,
          ],
          { type: "interval", gaps, spacing, endpoints, closed, ask: "flags" },
        );
      }
      const second = int(2, 4),
        first = int(2, 4),
        step = int(1, 2),
        answer = first + second + 1;
      return problem(
        `两段小路首尾相接，第一段 ${first * step} 米，第二段 ${second * step} 米。每隔 ${step} 米放一面旗，两端和连接处都放，连接处只放一面。一共需要几面？`,
        answer,
        "可以分成两段数，但连接处有没有被你数了两次？",
        [
          `第一段有 ${first + 1} 个放旗的位置，第二段有 ${second + 1} 个`,
          `连接处被两段各数了一次，应去掉重复的1面`,
          `${first + 1} + ${second + 1} − 1 = ${answer} 面`,
        ],
        { type: "interval-join", first, second, spacing: step },
      );
    }
    case "redistribute": {
      if (level === 1) {
        const b = int(2, 5),
          move = int(1, 3),
          a = b + move * 2;
        return problem(
          `小兔有 ${a} 颗珠子，小熊有 ${b} 颗。小兔要给小熊几颗，两人才一样多？`,
          move,
          "试着移1颗：小兔少1颗，小熊多1颗，两人的差会缩小几颗？",
          [
            `原来相差 ${a - b} 颗`,
            `每移1颗，差缩小2颗`,
            `把 ${a - b} 分成同样多的两份，每份 ${move}，所以要移 ${move} 颗`,
          ],
          { type: "redistribute", a, b, targetDifference: 0 },
        );
      }
      if (level === 2) {
        const move = int(1, 3),
          remaining = int(0, 3) * 2;
        if (index % 2)
          return problem(
            `小兔给小熊 ${move} 颗珠子后，仍比小熊多 ${remaining} 颗。小兔原来比小熊多几颗？`,
            move * 2 + remaining,
            "把移动过程倒着想：每拿回来1颗，双方的差会变大多少？",
            [
              `移出 ${move} 颗，会让双方的差缩小 ${move * 2} 颗`,
              `原来的差要把缩小的部分加回去`,
              `${remaining} + ${move * 2} = ${remaining + move * 2} 颗`,
            ],
            { type: "redistribute-reverse", move, remaining },
          );
        const b = int(2, 4),
          a = b + move * 2 + remaining;
        return problem(
          `小兔有 ${a} 颗珠子，小熊有 ${b} 颗。小兔给小熊几颗后，会恰好比小熊多 ${remaining} 颗？`,
          move,
          "这次不是一定分到相等，要保留题目指定的差。",
          [
            `原来相差 ${a - b} 颗，最后还要相差 ${remaining} 颗`,
            `只需缩小 ${a - b - remaining} 颗的差，每移1颗缩小2颗`,
            `所以移 ${move} 颗；移后是 ${a - move} 颗和 ${b + move} 颗，差正好 ${remaining}`,
          ],
          { type: "redistribute", a, b, targetDifference: remaining },
        );
      }
      const equal = int(3, 6),
        x = int(1, equal - 1),
        y = int(1, equal - x),
        piles = [equal + x + y, equal - x, equal - y];
      return problem(
        `三盒积木分别有 ${piles.join("、")} 块。只能从第一盒取出积木，分给另外两盒，使三盒一样多。最少一共要从第一盒取出几块？`,
        x + y,
        "先把三盒看成一个整体，想想平均摆完后每盒是多少，再看缺了多少。",
        [
          `三盒一共 ${equal * 3} 块，分成3份，每盒应是 ${equal} 块`,
          `第二盒还差 ${x} 块，第三盒还差 ${y} 块`,
          `第一盒一共给出 ${x} + ${y} = ${x + y} 块；每一块都补在缺少的盒子里，不必来回移动`,
        ],
        { type: "equalize-three", piles },
      );
    }
    case "sumdiff": {
      if (level === 1) {
        const smaller = int(2, 6),
          difference = int(1, 5),
          sum = smaller * 2 + difference,
          ask = index % 2 ? "larger" : "smaller",
          answer = ask === "larger" ? smaller + difference : smaller;
        return problem(
          `小兔和小熊共有 ${sum} 颗珠子，小兔比小熊多 ${difference} 颗。${ask === "larger" ? "小兔" : "小熊"}有多少颗？`,
          answer,
          "画两条长短不同的线段，把较长那条多出来的一段先盖住。",
          [
            `先拿掉小兔多出的 ${difference} 颗，还剩 ${sum - difference} 颗`,
            `这时两份一样多，每份 ${smaller} 颗`,
            ask === "larger"
              ? `小兔还要加回多出的部分：${smaller} + ${difference} = ${answer}`
              : `小熊就是其中一份，有 ${answer} 颗`,
          ],
          { type: "sumdiff", sum, difference, ask },
        );
      }
      if (level === 2) {
        const smaller = int(3, 6),
          move = int(1, 3),
          difference = move * 2,
          sum = smaller * 2 + difference;
        if (index % 2)
          return problem(
            `小兔和小熊共有 ${sum} 颗珠子。小兔给小熊 ${move} 颗后，两人一样多。小兔原来有多少颗？`,
            smaller + difference,
            "移过去1颗，差会缩小2颗。先把“给几颗”换成原来的差。",
            [
              `小兔给出 ${move} 颗后相等，所以原来多 ${difference} 颗`,
              `从总数中拿掉这 ${difference} 颗，剩下两份各 ${smaller} 颗`,
              `小兔原有 ${smaller} + ${difference} = ${smaller + difference} 颗`,
            ],
            { type: "sumdiff-transfer", sum, move },
          );
        const remove = int(1, 2);
        return problem(
          `小兔比小熊多 ${difference} 颗珠子。两人各用掉 ${remove} 颗后，还共有 ${sum - remove * 2} 颗。小兔原来有多少颗？`,
          smaller + difference,
          "两个人各用掉的珠子都要加回去；各减少同样多，双方的差有没有改变？",
          [
            `原来一共 ${sum - remove * 2} + ${remove} + ${remove} = ${sum} 颗`,
            `原来的差仍是 ${difference} 颗`,
            `先去掉差，分成相同的两份，每份 ${smaller}；小兔原有 ${smaller + difference} 颗`,
          ],
          {
            type: "sumdiff-after-remove",
            sumAfter: sum - remove * 2,
            remove,
            difference,
          },
        );
      }
      const base = int(2, 5),
        d1 = int(1, 3),
        d2 = d1 === 1 ? int(2, 3) : d1 === 2 ? (int(0, 1) ? 1 : 3) : int(1, 2),
        amounts = [base + d1, base, base + d2],
        target = index % 3,
        names = ["小兔", "小熊", "小猫"];
      return problem(
        `小兔、小熊和小猫共有 ${total(amounts)} 颗珠子。小兔比小熊多 ${d1} 颗，小猫比小熊多 ${d2} 颗。${names[target]}有多少颗？`,
        amounts[target],
        "把三个人都先画成和小熊一样多，再把两处多出的部分单独圈出来。",
        [
          `先去掉小兔和小猫多出的 ${d1} + ${d2} = ${d1 + d2} 颗`,
          `剩下 ${base * 3} 颗是3份同样多的小熊，每份 ${base} 颗`,
          `${names[target]}有 ${amounts[target]} 颗，再把三人数量相加并核对两个差`,
        ],
        { type: "sumdiff-three", sum: total(amounts), d1, d2, target },
      );
    }
    case "replacement": {
      if (level === 1) {
        const a = int(2, 4),
          b = int(2, 4);
        return problem(
          `在这道天平游戏里，同种物品一样重。1个苹果和 ${a} 个梨一样重，1个梨和 ${b} 块积木一样重。1个苹果相当于几块积木？`,
          a * b,
          "把每个梨都换成对应的一组积木，一组一组数，不需要先学乘法。",
          [
            `1个苹果可换成 ${a} 个梨`,
            `每个梨又可换成 ${b} 块积木`,
            `${Array(a).fill(b).join(" + ")} = ${a * b}，所以相当于 ${a * b} 块`,
          ],
          { type: "replace-chain", a, b },
        );
      }
      let apple = int(2, 4),
        pear = int(1, 3);
      if (apple + pear > 6) pear = 2;
      if (level === 2)
        return problem(
          `天平游戏里同种物品一样重。1个苹果加1个梨，相当于 ${apple + pear} 块积木；1个苹果加2个梨，相当于 ${apple + pear * 2} 块积木。1个苹果相当于几块积木？`,
          apple,
          "对照两次称重：相同的苹果和梨都不变，第二次只多了什么？",
          [
            `第二次只多1个梨，却多了 ${pear} 块积木，所以1个梨相当于 ${pear} 块`,
            `从第一组 ${apple + pear} 块中去掉这个梨的 ${pear} 块`,
            `苹果相当于 ${apple + pear} − ${pear} = ${apple} 块`,
          ],
          {
            type: "replace-common",
            first: apple + pear,
            second: apple + pear * 2,
          },
        );
      return problem(
        `天平游戏里同种物品一样重。2个苹果加1个梨，相当于 ${apple * 2 + pear} 块积木；1个苹果加2个梨，相当于 ${apple + pear * 2} 块积木。1个苹果加1个梨，相当于几块积木？`,
        apple + pear,
        "不要急着分别求苹果和梨。把两组放到一起，能分成几组“1个苹果加1个梨”？",
        [
          `两组放在一起，有3个苹果和3个梨，相当于 ${3 * (apple + pear)} 块积木`,
          `正好分成3组“1个苹果加1个梨”`,
          `每组相当于 ${apple + pear} 块，不用分别求出每种水果的重量`,
        ],
        {
          type: "replace-whole",
          first: apple * 2 + pear,
          second: apple + pear * 2,
        },
      );
    }
    case "restricted-enumeration": {
      if (level < 3) {
        let target = int(4, 12),
          cap1 = level === 1 ? target : int(3, 7),
          cap2 = level === 1 ? Math.floor(target / 2) : int(1, 4);
        let pairs = range(cap2 + 1)
          .map((two) => ({ one: target - 2 * two, two }))
          .filter((p) => p.one >= 0 && p.one <= cap1);
        if (!pairs.length) {
          target = cap1 + 2;
          pairs = range(cap2 + 1)
            .map((two) => ({ one: target - 2 * two, two }))
            .filter((p) => p.one >= 0 && p.one <= cap1);
        }
        const prompt =
          level === 1
            ? `用1分和2分的玩具代币凑出 ${target} 分，每种代币数量都够用，也可以不用某一种。按两种代币各用了几枚区分，有多少种不同凑法？`
            : `只有 ${cap1} 枚1分代币和 ${cap2} 枚2分代币。要凑出 ${target} 分，有几种凑法？每种可以不用；只比较各用了几枚，不区分拿取顺序。`;
        return problem(
          prompt,
          pairs.length,
          "先固定2分代币的枚数，从0枚开始，一种一种试。记得检查剩下的钱和枚数限制。",
          [
            `按2分代币从少到多列出合法凑法`,
            ...pairs.map((p) => `${p.two} 枚2分和 ${p.one} 枚1分`),
            `一共 ${pairs.length} 种；改变拿取顺序不算新凑法`,
          ],
          { type: "coin-enumeration", target, cap1, cap2 },
        );
      }
      const count = int(4, 6);
      let target = int(7, 14),
        solutions = [];
      const solve = (n) =>
        range(3)
          .flatMap((five) =>
            range(count + 1).map((two) => ({
              five,
              two,
              one: count - five - two,
            })),
          )
          .filter((s) => s.one >= 0 && s.one + 2 * s.two + 5 * s.five === n);
      for (let n = target; !solutions.length; n = n === 14 ? 7 : n + 1) {
        target = n;
        solutions = solve(n);
      }
      return problem(
        `用1分、2分和5分代币，总共恰好拿 ${count} 枚，合计 ${target} 分。某种可以不用，按每种用了几枚区分，有多少种凑法？`,
        solutions.length,
        "这次有“总钱数”和“总枚数”两个条件。先固定5分代币，再把另外两种列成表检查。",
        [
          `每种方案都要同时满足 ${count} 枚和 ${target} 分`,
          ...solutions.map(
            (s) => `1分 ${s.one} 枚、2分 ${s.two} 枚、5分 ${s.five} 枚`,
          ),
          `逐行核对两个条件，共 ${solutions.length} 种`,
        ],
        { type: "coin-count-enumeration", count, target },
      );
    }
    case "grid-routes": {
      const columns = level === 1 ? int(1, 4) : int(2, 3),
        rows = level === 1 ? int(1, 2) : int(2, 3),
        point = {
          x: int(1, Math.max(1, columns - 1)),
          y: int(1, Math.max(1, rows - 1)),
        },
        via = level === 2 ? point : null,
        blocked = level === 3 ? point : null,
        answer = routes(columns, rows, blocked, via);
      const condition = via
        ? "必须经过蓝旗所在的交点。"
        : blocked
          ? "不能经过红叉所在的交点，也不能跨过它。"
          : "";
      const steps =
        level === 1
          ? [
              "按第一步向右或向下分组，把路线画在纸上，每条只记一次",
              `从起点沿允许方向逐条检查，共 ${answer} 条`,
            ]
          : level === 2
            ? [
                "先分别数“起点到蓝旗”和“蓝旗到终点”的走法",
                `前一段有 ${routes(point.x, point.y)} 种，后一段有 ${routes(columns - point.x, rows - point.y)} 种；每种前段都可以接每种后段`,
                `逐一配对或画表，一共 ${answer} 条`,
              ]
            : [
                `不设障碍时，共 ${routes(columns, rows)} 条`,
                `经过红叉的有 ${routes(columns, rows, null, point)} 条；这些路线都不能走`,
                `去掉经过红叉的路线，剩 ${answer} 条，也可以直接逐条画出合法路线核对`,
              ];
      return problem(
        `路网横向有 ${columns} 格，纵向有 ${rows} 格。小兔从左上角去右下角的树屋，每次只能沿线向右或向下走，不能走回头路。${condition}一共有几条不同路线？`,
        answer,
        level === 1
          ? "先固定第一步，把走法分组记录，别在同一条线上来回走。"
          : level === 2
            ? "把蓝旗当作中间站：分别找前后两段的走法，再想它们怎样搭配。"
            : "先比较“全部路线”和“经过红叉的路线”，或把合法路线一条条画出来。",
        steps,
        { type: "grid-routes", columns, rows, via, blocked },
        { diagram: { type: "grid", columns, rows, via, blocked } },
      );
    }
    case "logic-matching": {
      const names = shuffle(["小兔", "小熊", "小猫", "小狗"], rng);
      if (level === 1) {
        const pets = shuffle(["猫", "鸟", "鱼"], rng),
          people = names.slice(0, 3),
          clues = [
            { person: 1, item: 0, equal: true },
            { person: 0, item: 1, equal: false },
          ],
          answer = pets[2];
        return problem(
          `${people.join("、")}分别照顾猫、鸟、鱼，每人一种，互不重复。${people[1]}照顾${pets[0]}；${people[0]}不照顾${pets[1]}。${people[0]}照顾什么？`,
          answer,
          "已经分配的先划掉，再用“不照顾”的线索排除一种。",
          [
            `${people[1]}已经照顾${pets[0]}，另外两人不能重复`,
            `对${people[0]}再排除${pets[1]}，只剩${pets[2]}`,
            `把剩下的${pets[1]}给${people[2]}，两条线索都符合`,
          ],
          { type: "matching", people, items: pets, clues, target: 0 },
          { kind: "choice", choices: shuffle(pets, rng) },
        );
      }
      if (level === 2) {
        const items = shuffle(["苹果", "香蕉", "橘子", "梨"], rng),
          clues = [
            { person: 0, item: 0, equal: false },
            { person: 0, item: 1, equal: false },
            { person: 1, item: 2, equal: false },
            { person: 1, item: 3, equal: false },
            { person: 2, item: 0, equal: true },
            { person: 3, item: 3, equal: false },
          ],
          answer = items[3];
        return problem(
          `${names.join("、")}每人拿一种水果，四种是${shuffle(items, rng).join("、")}，互不重复。${names[0]}既不拿${items[0]}，也不拿${items[1]}；${names[1]}既不拿${items[2]}，也不拿${items[3]}；${names[2]}拿${items[0]}；${names[3]}不拿${items[3]}。${names[0]}拿什么？`,
          answer,
          "画一个“人和水果”的表：先填确定的，再把已占用和不符合的格子划掉。",
          [
            `${names[2]}拿${items[0]}，因此${names[1]}只能拿${items[1]}`,
            `${names[0]}和${names[3]}只剩${items[2]}、${items[3]}，而${names[3]}不拿${items[3]}`,
            `所以${names[0]}拿${items[3]}；再逐条检查所有条件`,
          ],
          { type: "matching", people: names, items, clues, target: 0 },
          { kind: "choice", choices: shuffle(items, rng) },
        );
      }
      const people = names.slice(0, 3),
        { statements, trueCount } = truthCases[int(0, truthCases.length - 1)];
      const candidates = range(3).filter(
        (owner) =>
          statements.filter((s) => (owner === s.owner) === s.equal).length ===
          trueCount,
      );
      const answer = people[candidates[0]],
        say = statements.map(
          (s, i) =>
            `${people[i]}说，球${s.equal ? "在" : "不在"}${people[s.owner]}的盒子里`,
        );
      return problem(
        `三个盒子分别属于${people.join("、")}，其中只有一个盒子装了球。${say.join("；")}。三句话中恰好有 ${trueCount} 句符合实际。球在哪个人的盒子里？`,
        answer,
        "依次假设球在每个人的盒子里，逐句判断，再数有几句话符合。",
        [
          ...range(3).map(
            (owner) =>
              `假设在${people[owner]}盒子里，会有 ${statements.filter((s) => (owner === s.owner) === s.equal).length} 句符合`,
          ),
          `只有${answer}对应恰好 ${trueCount} 句，因此选${answer}`,
        ],
        { type: "truth-statements", people, statements, trueCount },
        { kind: "choice", choices: shuffle(people, rng) },
      );
    }
  }
}
