import {
  localDay,
  mastery,
  availability,
  plan,
  makeSession,
  makeItem,
  isCorrect,
} from "./engine.js?v=30";
import * as store from "./store.js?v=30";
import {
  createSpeechReader,
  questionSpeech,
  spokenText,
  speechErrorMessage,
} from "./audio.js?v=30";
const labels = {
    math: "数学小课堂",
    english: "英语启蒙",
    thinking: "思维探索",
  },
  statusLabel = {
    new: "还没开始",
    practising: "正在练习",
    secure: "已有掌握证据",
  };
const HABITS = [
  ["prepare", "开始前，自己准备书本与文具"],
  ["explain", "学完后，用自己的话讲明白一点"],
  ["review", "遇到错题，找原因再试一试"],
  ["tidy", "结束后，整理书包和桌面"],
];
let bootstrap;
export function createLearningComponents(React) {
  const h = React.createElement;
  function useLearning() {
    const state = React.useSyncExternalStore(
        store.subscribe,
        store.getSnapshot,
        store.getSnapshot,
      ),
      [error, setError] = React.useState("");
    React.useEffect(() => {
      bootstrap ||= store.initialize().then(() => store.refreshCatalog());
      bootstrap.catch((e) => setError(e.message));
    }, []);
    return { state, error };
  }
  const btn = (text, onClick, props = {}) =>
    h("button", { type: "button", onClick, ...props }, text);
  function Heading({ title, kicker = "MARIO · 每天学懂一点点", children }) {
    return h(
      "header",
      { className: "edu-heading" },
      h("div", null, h("small", null, kicker), h("h2", null, title), children),
    );
  }
  function Loading({ error }) {
    return h(
      "div",
      { className: "edu-card", role: "status" },
      error || "正在读取学习记录和课程内容…",
      error &&
        btn("重新读取", () => {
          bootstrap = null;
          location.reload();
        }),
    );
  }
  function StorageNotice() {
    const status = store.getStorageStatus();
    return status.error
      ? h("p", { className: "edu-notice", role: "status" }, status.error)
      : null;
  }
  function LearningDashboard({ onNavigate, onComplete }) {
    const { state, error } = useLearning();
    if (!state.catalog) return h(Loading, { error });
    return h(
      "div",
      { className: "edu-page" },
      h(StorageNotice),
      h(
        "section",
        { className: "edu-dashboard" },
        h(
          Heading,
          {
            title: "今天，走好自己的这一小步",
            kicker: "一年级 · 理解 / 习惯 / 好奇心",
          },
          h("p", null, "按学习记录安排复习与新练习，做完一小轮就可以休息。"),
        ),
        h(
          "div",
          { className: "edu-plan-grid" },
          ...["math", "english", "thinking"].map((subject) => {
            const p = plan(subject, state.catalog, state);
            return h(
              "button",
              {
                className: "edu-plan " + subject,
                onClick: () => onNavigate(subject),
                key: subject,
              },
              h(
                "span",
                { className: "edu-plan-icon" },
                subject === "math" ? "🧮" : subject === "english" ? "🎧" : "💡",
              ),
              h(
                "small",
                null,
                subject === "math"
                  ? "课堂同步"
                  : subject === "english"
                    ? "从听懂开始"
                    : "兴趣探索",
              ),
              h("b", null, p.selected[0]?.title || labels[subject]),
              h(
                "span",
                null,
                subject === "math"
                  ? "6题左右 · 看图、计算、讲思路"
                  : subject === "english"
                    ? "短时听说 · 生活中用一次"
                    : "七个主题 · 起步、进阶、挑战",
              ),
              h("em", null, p.reason + " →"),
            );
          }),
        ),
        h(
          "div",
          { className: "edu-dashboard-foot" },
          h(
            "span",
            null,
            "🧭 课堂进度：" +
              (state.catalog.skills.find(
                (s) => s.id === state.profile.schoolSkill,
              )?.title || "待设置"),
          ),
          btn("成长路线", () => onNavigate("roadmap")),
          btn("家长设置与备份", () => onNavigate("learning-settings")),
        ),
      ),
      h(Habits, { state, onComplete }),
      h(
        "section",
        { className: "edu-card" },
        h("h3", null, "还想探索一点？"),
        h(
          "p",
          null,
          "按今天的精力选一项，读一读、动一动，或看看一起长大的伙伴。",
        ),
        h(
          "div",
          { className: "edu-resource-grid" },
          ...[
            ["pinyin", "🔤", "拼音练习"],
            ["hanzi", "字", "认识生字"],
            ["poem", "📜", "古诗朗读"],
            ["science", "🔭", "好奇小科学"],
            ["sport", "🤸", "运动小活动"],
            ["games", "🧩", "益智小游戏"],
            ["pet", "♞", "宠物伙伴"],
            ["calendar", "📅", "成长日历"],
          ].map(([id, icon, title]) =>
            btn(icon + " " + title, () => onNavigate(id), { key: id }),
          ),
        ),
        h(
          "small",
          null,
          "拼音、生字等沿用原有资源，暂未与具体教材版次逐课对应。",
        ),
      ),
    );
  }
  function Roadmap({ state, onPractice }) {
    const catalog = state.catalog;
    return h(
      "div",
      null,
      h(
        Heading,
        { title: "成长路线", kicker: "掌握一小步，再向前一点" },
        h(
          "p",
          null,
          "课堂进度由家长核对；金币与签到不会自动解锁知识。下学期每个主题分别检查前置知识。",
        ),
      ),
      ...["math", "english", "thinking"].map((subject) =>
        h(
          "section",
          { className: "edu-card", key: subject },
          h("h3", null, labels[subject]),
          h(
            "div",
            { className: "edu-roadmap" },
            ...catalog.skills
              .filter((s) => s.subject === subject)
              .map((s) => {
                const m = mastery(s.id, state.attempts),
                  a = availability(s, catalog, state);
                return h(
                  "article",
                  { className: "edu-node " + m.status, key: s.id },
                  h(
                    "div",
                    null,
                    h(
                      "small",
                      null,
                      s.level
                        ? `轻奥第${s.level}层 · ${s.levelTitle}`
                        : s.track === "foundation"
                          ? "数学思维基础"
                          : s.term === 2
                            ? "下学期方向 · 按掌握开放"
                            : "本阶段主题",
                    ),
                    h("h4", null, s.title),
                    h("p", null, s.goal),
                    h(
                      "span",
                      null,
                      statusLabel[m.status] + (m.due ? " · 到期复习" : ""),
                    ),
                    h(
                      "small",
                      null,
                      `${m.independent} 次不同题目的独立作答 · ${m.days} 个学习日`,
                    ),
                  ),
                  btn(
                    a.allowed ? "试一小步" : "尚未开放",
                    () => onPractice(s),
                    { disabled: !a.allowed, title: a.reason || s.coach },
                  ),
                  !a.allowed &&
                    h("p", { className: "edu-lock-reason" }, a.reason),
                );
              }),
          ),
        ),
      ),
      h(
        "aside",
        { className: "edu-note" },
        "掌握证据：至少6道不同题目的独立作答，近12道独立题正确率不低于80%，正确证据跨至少2天，包含迁移题，并有家长观察到的自主解释。这个阈值是可调整的产品规则，不是标准化测评。",
      ),
    );
  }
  function Habits({ state, onComplete }) {
    const day = localDay(),
      values = state.habits[day] || {};
    return h(
      "section",
      { className: "edu-card edu-habits" },
      h("h3", null, "今天的小习惯"),
      h("p", null, "选一个最需要练习的就好，由孩子实际完成后勾选。"),
      ...HABITS.map(([id, label]) =>
        h(
          "label",
          { key: id },
          h("input", {
            type: "checkbox",
            checked: !!values[id],
            onChange: async (e) => {
              const checked = e.target.checked;
              try {
                await store.update((s) => {
                  s.habits[day] ||= {};
                  s.habits[day][id] = checked;
                });
                if (checked) onComplete?.("habits", 2);
              } catch {}
            },
          }),
          label,
        ),
      ),
      h("small", null, "勾选记录的是生活习惯，不计作知识掌握。"),
    );
  }
  function PuzzleDiagram({ diagram }) {
    if (
      diagram?.type === "bars" &&
      Array.isArray(diagram.extras) &&
      diagram.extras.length <= 3
    )
      return h(
        "figure",
        { className: "edu-bars" },
        ...diagram.extras.map((extra, i) =>
          h(
            "div",
            { className: "edu-bar-row", key: i },
            h("span", null, diagram.names[i]),
            h("div", { className: "edu-bar-common" }, "?"),
            extra > 0 && h("div", { className: "edu-bar-extra" }, `多${extra}`),
          ),
        ),
        h(
          "figcaption",
          null,
          `一共 ${diagram.sum} 颗 · 相同颜色表示相同的一份；示意图不按实际数量比例绘制。`,
        ),
      );
    if (diagram?.type !== "grid") return null;
    const columns = diagram.columns,
      rows = diagram.rows;
    if (
      !Number.isInteger(columns) ||
      !Number.isInteger(rows) ||
      columns < 1 ||
      rows < 1 ||
      columns > 4 ||
      rows > 4
    )
      return null;
    const step = 54,
      nodes = [];
    for (let y = 0; y <= rows; y++)
      for (let x = 0; x <= columns; x++) {
        if (x < columns)
          nodes.push(
            h("line", {
              key: `r${x}-${y}`,
              x1: x * step,
              y1: y * step,
              x2: (x + 1) * step,
              y2: y * step,
              stroke: "#93b5bd",
              strokeWidth: 3,
            }),
          );
        if (y < rows)
          nodes.push(
            h("line", {
              key: `d${x}-${y}`,
              x1: x * step,
              y1: y * step,
              x2: x * step,
              y2: (y + 1) * step,
              stroke: "#93b5bd",
              strokeWidth: 3,
            }),
          );
        nodes.push(
          h("circle", {
            key: `p${x}-${y}`,
            cx: x * step,
            cy: y * step,
            r: 4,
            fill: "#4f8791",
          }),
        );
      }
    if (diagram.via)
      nodes.push(
        h(
          "text",
          {
            key: "via",
            x: diagram.via.x * step,
            y: diagram.via.y * step + 7,
            fill: "#2374c0",
            fontSize: 30,
            textAnchor: "middle",
          },
          "⚑",
        ),
      );
    if (diagram.blocked)
      nodes.push(
        h(
          "g",
          { key: "blocked" },
          h("circle", {
            cx: diagram.blocked.x * step,
            cy: diagram.blocked.y * step,
            r: 12,
            fill: "white",
          }),
          h(
            "text",
            {
              x: diagram.blocked.x * step,
              y: diagram.blocked.y * step + 9,
              fill: "#c74c4c",
              fontSize: 30,
              textAnchor: "middle",
            },
            "×",
          ),
        ),
      );
    nodes.push(
      h(
        "text",
        { key: "start", x: 0, y: 7, fontSize: 24, textAnchor: "middle" },
        "🐰",
      ),
      h(
        "text",
        {
          key: "end",
          x: columns * step,
          y: rows * step + 7,
          fontSize: 24,
          textAnchor: "middle",
        },
        "🏠",
      ),
    );
    return h(
      "figure",
      { className: "edu-grid-puzzle" },
      h(
        "svg",
        {
          viewBox: `-25 -25 ${columns * step + 50} ${rows * step + 50}`,
          role: "img",
          "aria-label": `${columns}格宽、${rows}格高的路线图，从左上小兔到右下树屋${diagram.via ? "，须经过蓝旗交点" : ""}${diagram.blocked ? "，不能经过红叉交点" : ""}`,
        },
        ...nodes,
      ),
      h(
        "figcaption",
        null,
        "🐰 起点 → 🏠 终点 · 只沿线向右或向下" +
          (diagram.via ? " · 必经蓝旗" : "") +
          (diagram.blocked ? " · 避开红叉" : ""),
      ),
    );
  }
  function ThinkingHub({ state, onPractice, onNavigate }) {
    const skills = state.catalog.skills.filter(
        (s) => s.subject === "thinking" && s.topicId && s.level,
      ),
      topics = [...new Set(skills.map((s) => s.topicId))],
      recommended = plan("thinking", state.catalog, state).selected[0];
    if (!skills.length)
      return h(
        "section",
        { className: "edu-card" },
        h("h3", null, "正在更新分层轻奥课程"),
        h(
          "p",
          null,
          "当前保存的是旧内容包，联网后会自动检查更新。也可以到家长设置检查课程更新。",
        ),
        btn("检查课程更新", () => onNavigate("learning-settings")),
      );
    return h(
      "div",
      null,
      h(
        Heading,
        {
          title: "一年级轻奥探索",
          kicker: "先画图，再推理；同一主题，逐层深入",
        },
        h(
          "p",
          null,
          "这次增加的是条件、关系和思考步骤。已经会基础，可以直接选进阶或挑战，不必先刷完整套起步题。",
        ),
      ),
      h(
        "div",
        { className: "edu-thinking-guide" },
        h("span", null, "1 起步 · 用图和实物理解方法"),
        h("span", null, "2 进阶 · 增加条件，换角度思考"),
        h("span", null, "3 挑战 · 联合条件，解释为什么"),
      ),
      recommended &&
        h(
          "aside",
          { className: "edu-coach" },
          h("b", null, "今天推荐的主题"),
          h("p", null, recommended.title),
          btn("继续推荐主题", () => onPractice(recommended)),
        ),
      h(
        "div",
        { className: "edu-topic-grid" },
        ...topics.map((topicId) => {
          const levels = skills
              .filter((s) => s.topicId === topicId)
              .sort((a, b) => a.level - b.level),
            first = levels[0];
          return h(
            "article",
            { className: "edu-card edu-topic", key: topicId },
            h("span", { className: "edu-topic-icon" }, first.icon),
            h("h3", null, first.topicTitle),
            h("p", null, levels[2].goal),
            h(
              "div",
              { className: "edu-levels" },
              ...levels.map((s) => {
                const m = mastery(s.id, state.attempts);
                return btn(
                  h(
                    React.Fragment,
                    null,
                    h("b", null, `${s.level} ${s.levelTitle}`),
                    h("small", null, s.title.split(" · ")[1]),
                    h("em", null, statusLabel[m.status]),
                  ),
                  () => onPractice(s),
                  {
                    "aria-label": `${s.topicTitle} ${s.levelTitle}`,
                    key: s.id,
                    className: m.status === "secure" ? "secure" : "",
                  },
                );
              }),
            ),
          );
        }),
      ),
      h(
        "p",
        { className: "edu-note" },
        "每层先看一道例题，再做3道不同变式。记录分层保存；换层不等于已经掌握。卡住可以用提示或退回上一层，不计时、不排名。原来的规律、排队等入门活动已归入数学小课堂的“数学思维基础”。",
      ),
    );
  }
  function Practice({
    subject,
    state,
    preferred,
    onComplete,
    onBack,
    onChoose,
  }) {
    const today = localDay(),
      catalog = state.catalog;
    const [activeId, setActiveId] = React.useState(
        () =>
          Object.values(state.sessions)
            .filter(
              (s) =>
                s.day === today &&
                s.subject === subject &&
                !s.archived &&
                !s.finished &&
                s.preferredId === (preferred || null),
            )
            .at(-1)?.id,
      ),
      [value, setValue] = React.useState(""),
      [supported, setSupported] = React.useState(false),
      [explained, setExplained] = React.useState(false),
      [heard, setHeard] = React.useState(false),
      [notice, setNotice] = React.useState(""),
      [busy, setBusy] = React.useState(false),
      [audioStatus, setAudioStatus] = React.useState("idle"),
      [audioMessage, setAudioMessage] = React.useState(""),
      [autoRead, setAutoRead] = React.useState(
        state.profile.autoReadQuestions !== false,
      ),
      [audioSaving, setAudioSaving] = React.useState(false);
    const readerRef = React.useRef(null),
      questionRef = React.useRef(null),
      lessonRef = React.useRef(null);
    if (!readerRef.current) readerRef.current = createSpeechReader();
    React.useEffect(
      () => setAutoRead(state.profile.autoReadQuestions !== false),
      [state.profile.autoReadQuestions],
    );
    const session = state.sessions[activeId],
      cursor = session?.cursor || 0,
      item = session?.items[cursor],
      result = session?.answers[item?.id],
      hintUsed = !!session?.hints?.[item?.id];
    const route = plan(subject, catalog, state),
      skill =
        catalog.skills.find((s) => s.id === preferred) || route.selected[0];
    const example = React.useMemo(
      () =>
        subject === "thinking" && skill
          ? makeItem(
              { ...skill, catalogVersion: catalog.version },
              "worked-example:" + catalog.version,
              0,
            )
          : null,
      [subject, skill?.id, catalog.version],
    );
    React.useEffect(() => {
      if (!session)
        lessonRef.current?.scrollIntoView({ block: "start", behavior: "auto" });
    }, [preferred]);
    React.useEffect(() => {
      setValue("");
      setSupported(false);
      setExplained(false);
      setHeard(false);
      setNotice("");
      if (item)
        questionRef.current?.scrollIntoView({
          block: "start",
          behavior: "auto",
        });
    }, [item?.id, activeId]);
    React.useEffect(() => {
      setAudioMessage("");
      setAudioStatus("idle");
      if ((item || (!session && example)) && autoRead) {
        const timer = setTimeout(() => {
          if (!item) readSegments(questionSpeech(example));
          else if (result)
            readSegments([
              {
                text:
                  (result.correct ? "答对了。" : "我们一起看看思路。") +
                  spokenText(item.explanation),
                lang: "zh-CN",
              },
            ]);
          else readQuestion();
        }, 100);
        return () => {
          clearTimeout(timer);
          readerRef.current.stop();
        };
      }
      readerRef.current.stop();
    }, [item?.id, activeId, result?.id, autoRead, example?.id]);
    React.useEffect(() => () => readerRef.current.stop(), []);
    async function act(action) {
      if (busy) return;
      setBusy(true);
      try {
        await action();
      } catch (error) {
        setNotice(error.message);
      } finally {
        setBusy(false);
      }
    }
    function readSegments(segments) {
      setAudioMessage("");
      return readerRef.current.read(segments, {
        onStatus: setAudioStatus,
        onError: (code) => setAudioMessage(speechErrorMessage(code)),
        onSegmentEnd: (segment) => {
          if (segment.purpose === "listening") setHeard(true);
        },
      });
    }
    function readQuestion() {
      return readSegments(questionSpeech(item));
    }
    async function changeAutoRead(checked) {
      const previous = autoRead;
      setAutoRead(checked);
      setAudioSaving(true);
      try {
        await store.update((s) => {
          s.profile.autoReadQuestions = checked;
        });
      } catch (error) {
        setAutoRead(previous);
        setNotice(error.message);
      } finally {
        setAudioSaving(false);
      }
    }
    function speak(text, lang = "zh-CN") {
      return readSegments([
        { text: lang === "zh-CN" ? spokenText(text) : text, lang },
      ]);
    }
    const start = () =>
      act(async () => {
        let created;
        await store.update((s) => {
          created = makeSession(subject, catalog, s, today, preferred);
          created.preferredId = preferred || null;
          created.cursor = 0;
          created.hints = {};
          if (!created.items.length)
            throw Error(
              "今天这个主题的不同题目已练过，换个主题或明天再复习吧。",
            );
          s.sessions[created.id] = created;
        });
        setActiveId(created.id);
      });
    const submit = () =>
      act(async () => {
        if (!item || result || !String(value).trim()) return;
        if (item.kind === "listening" && !heard && !supported) {
          setNotice("请先播放声音；由家长示范时勾选陪伴练习。");
          return;
        }
        if (session.day !== localDay())
          throw Error("已经是新的一天，请返回后开始今天的练习。");
        await store.update((s) => {
          const run = s.sessions[session.id];
          if (run.answers[item.id]) return;
          const attempt = {
            id: crypto.randomUUID(),
            itemId: item.id,
            skillId: item.skillId,
            catalogVersion: session.catalogVersion,
            day: session.day,
            at: new Date().toISOString(),
            kind: item.kind,
            response: value,
            correct: isCorrect(item, value),
            hintUsed: !!run.hints?.[item.id],
            supported,
            explained,
            transfer: item.transfer,
            item,
          };
          s.attempts.push(attempt);
          run.answers[item.id] = attempt;
        });
      });
    const next = () =>
      act(() =>
        store.update((s) => {
          s.sessions[session.id].cursor = cursor + 1;
        }),
      );
    const finish = () =>
      act(async () => {
        await store.update((s) => {
          s.sessions[session.id].finished = true;
        });
        onComplete?.(subject, subject === "math" ? 5 : 4);
        setNotice("这次学习已保存。休息一下，明天再看看还记不记得。");
      });
    if (!skill)
      return h(
        "div",
        { className: "edu-card" },
        "当前没有可用主题，请在家长设置中核对课堂进度。",
      );
    if (!session)
      return h(
        "div",
        { className: "edu-lesson-overview", ref: lessonRef },
        h(
          Heading,
          { title: labels[subject] },
          h(
            "p",
            null,
            subject === "thinking"
              ? "先用例题理解方法，再做不同变式。可以画图、列举、假设验证，不要求背公式。"
              : subject === "english"
                ? "先听懂、再回应，最后在生活里用一句。暂不要求拼写和背语法。"
                : "看图、摆实物、讲原因，比一次刷很多题更有帮助。",
          ),
        ),
        h(
          "article",
          { className: "edu-card edu-lesson" },
          h("small", null, preferred ? "自选主题" : route.reason),
          h("h3", null, skill.title),
          skill.level &&
            h(
              "span",
              { className: "edu-level-badge" },
              `第${skill.level}层 · ${skill.levelTitle}`,
            ),
          h("p", null, skill.goal),
          h(
            "div",
            { className: "edu-coach" },
            h("b", null, "陪伴提示"),
            h("p", null, skill.coach),
          ),
          example &&
            h(
              "section",
              { className: "edu-worked-example" },
              h("h4", null, "先看一道例题"),
              h("p", null, example.prompt),
              h(PuzzleDiagram, { diagram: example.diagram }),
              btn("🔊 重播读题", () => readSegments(questionSpeech(example))),
              h(
                "details",
                null,
                h("summary", null, "先想一想，再看解题方法"),
                h(
                  "ol",
                  null,
                  ...(example.steps || [example.explanation]).map((step, i) =>
                    h("li", { key: i }, step),
                  ),
                ),
                btn("🔊 听解题方法", () => speak(example.explanation)),
              ),
              h(
                "small",
                null,
                "例题只帮助理解方法，不计入学习证据，也不会原题出现在这一轮练习里。",
              ),
            ),
          subject === "english" &&
            h(
              React.Fragment,
              null,
              h(
                "div",
                { className: "edu-word-grid" },
                ...skill.words.map((w) =>
                  btn(
                    h(
                      React.Fragment,
                      null,
                      h("span", null, w.picture),
                      h("b", null, w.en),
                      h("small", null, w.zh),
                    ),
                    () => speak(w.en, "en-US"),
                    { key: w.en },
                  ),
                ),
              ),
              h("h4", null, "一起说一小段"),
              ...skill.dialogue.map((d) =>
                h(
                  "div",
                  { className: "edu-dialogue", key: d.en },
                  btn("🔊 " + d.en, () => speak(d.en, "en-US")),
                  h("span", null, d.zh),
                ),
              ),
              h(
                "div",
                { className: "edu-coach" },
                h("b", null, "离开屏幕，试一次"),
                h("p", null, skill.activity),
              ),
            ),
          btn(busy ? "正在准备…" : "开始这一小轮 →", start, {
            className: "edu-primary",
            disabled: busy,
          }),
          h("p", { role: "status" }, notice || audioMessage),
          btn("看看其他主题", onBack),
        ),
        subject === "math" && h(Habits, { state, onComplete }),
        subject === "math" &&
          h(
            "section",
            { className: "edu-card" },
            h("h3", null, "数学思维基础"),
            h("p", null, "规律、简单排序等入门活动放在这里，按需要选做。"),
            h(
              "div",
              { className: "edu-resource-grid" },
              ...catalog.skills
                .filter((s) => s.track === "foundation")
                .map((s) =>
                  btn(s.title.replace("思维基础 · ", ""), () => onChoose(s), {
                    key: s.id,
                  }),
                ),
            ),
          ),
      );
    if (!item) {
      const answers = Object.values(session.answers),
        independent = answers.filter(
          (a) => a.correct && !a.hintUsed && !a.supported,
        );
      return h(
        "section",
        { className: "edu-card edu-finish" },
        h("span", { className: "edu-finish-star" }, "🌱"),
        h("h2", null, "认真尝试，就是进步"),
        h(
          "p",
          null,
          `这次尝试 ${answers.length} 题，其中 ${independent.length} 题独立答对。`,
        ),
        h("p", null, "一次练习只是学习记录，隔天会安排复习。"),
        !session.finished
          ? btn("完成本次学习，保存打卡", finish, {
              className: "edu-primary",
              disabled: busy,
            })
          : h("p", { role: "status" }, notice || "本次学习已保存"),
        subject === "thinking" && h(Interest, { session }),
        subject === "thinking" &&
          skill.level < 3 &&
          independent.length === answers.length &&
          answers.length >= 3 &&
          answers.some((a) => a.explained) &&
          btn("想再试试？挑战下一层（可选）", () =>
            onChoose(
              catalog.skills.find(
                (s) =>
                  s.topicId === skill.topicId && s.level === skill.level + 1,
              ),
            ),
          ),
        btn("回到成长路线", onBack),
      );
    }
    return h(
      "div",
      null,
      h(
        Heading,
        {
          title: labels[subject],
          kicker: `第 ${cursor + 1} / ${session.items.length} 题 · 不计时`,
        },
        h("p", null, catalog.skills.find((s) => s.id === item.skillId)?.title),
      ),
      h(
        "article",
        { className: "edu-card edu-question", ref: questionRef },
        h(
          "div",
          { className: "edu-question-top" },
          h("span", null, item.transfer ? "换个情境试一试" : "理解与练习"),
          btn("🔊 重播读题", readQuestion),
        ),
        h(
          "div",
          { className: "edu-audio-bar" },
          h(
            "label",
            null,
            h("input", {
              type: "checkbox",
              checked: autoRead,
              disabled: audioSaving,
              onChange: (e) => changeAutoRead(e.target.checked),
            }),
            "每题自动读",
          ),
          h(
            "span",
            { role: "status", "aria-live": "polite" },
            audioMessage ||
              (audioStatus === "speaking"
                ? "正在读题…"
                : audioStatus === "loading"
                  ? "正在准备声音…"
                  : autoRead
                    ? "进入下一题会自动播报"
                    : "已关闭自动播报，可以点重播读题"),
          ),
          ["speaking", "loading"].includes(audioStatus) &&
            btn("停止朗读", () => {
              readerRef.current.stop();
              setAudioStatus("idle");
            }),
        ),
        h("h3", null, item.prompt),
        item.visual &&
          h(
            "div",
            { className: "edu-visual", "aria-label": "题目图示" },
            item.visual,
          ),
        h(PuzzleDiagram, { diagram: item.diagram }),
        item.kind === "listening" &&
          btn(
            "🎧 播放英语声音",
            () =>
              readSegments([
                { text: item.listen, lang: "en-US", purpose: "listening" },
              ]),
            {
              className: "edu-listen",
            },
          ),
        item.choices
          ? h(
              "div",
              { className: "edu-choices" },
              ...item.choices.map((choice, i) => {
                const val = typeof choice === "object" ? choice.en : choice;
                return btn(
                  typeof choice === "object"
                    ? h(
                        React.Fragment,
                        null,
                        h(
                          "span",
                          { className: "edu-choice-picture" },
                          choice.picture,
                        ),
                        result &&
                          h("small", null, choice.en + " · " + choice.zh),
                      )
                    : h(
                        React.Fragment,
                        null,
                        h("small", { className: "edu-choice-number" }, i + 1),
                        choice,
                      ),
                  () => setValue(val),
                  {
                    key: val,
                    disabled: !!result,
                    className: value === val ? "chosen" : "",
                    "aria-label":
                      typeof choice === "object"
                        ? `图片${i + 1}：${choice.zh}`
                        : val,
                    "aria-pressed": value === val,
                  },
                );
              }),
            )
          : h(
              "label",
              { className: "edu-answer" },
              "我的答案",
              h("input", {
                inputMode: "numeric",
                autoComplete: "off",
                value,
                disabled: !!result,
                onChange: (e) => setValue(e.target.value.replace(/\D/g, "")),
                "aria-label": "我的答案",
                onKeyDown: (e) => {
                  if (e.key === "Enter") submit();
                },
              }),
            ),
        !result &&
          h(
            "div",
            { className: "edu-evidence" },
            h(
              "label",
              null,
              h("input", {
                type: "checkbox",
                checked: supported,
                onChange: (e) => setSupported(e.target.checked),
              }),
              "陪伴练习：家长帮忙完成或示范",
            ),
            h(
              "label",
              null,
              h("input", {
                type: "checkbox",
                checked: explained,
                onChange: (e) => setExplained(e.target.checked),
              }),
              subject === "english"
                ? "家长观察：能主动回应，并在生活里用出来"
                : "家长观察：未看讲解，孩子能自己讲出理由",
            ),
          ),
        !result &&
          h(
            "div",
            { className: "edu-actions" },
            btn("给我一点提示", () =>
              act(async () => {
                await store.update((s) => {
                  s.sessions[session.id].hints[item.id] = true;
                });
                if (autoRead) speak("一点提示。" + item.hint);
              }),
            ),
            btn("提交答案", submit, {
              className: "edu-primary",
              disabled: busy || !String(value).trim(),
            }),
          ),
        hintUsed &&
          h(
            "aside",
            { className: "edu-coach" },
            item.hint,
            "（这道记录为有提示练习）",
          ),
        result &&
          h(
            "div",
            {
              className:
                "edu-feedback " + (result.correct ? "correct" : "try-again"),
              role: "status",
            },
            h(
              "b",
              null,
              result.correct ? "想明白了，真好！" : "我们一起看看思路",
            ),
            h("p", null, item.explanation),
            h(
              "small",
              null,
              result.hintUsed || result.supported
                ? "这次有帮助，下一次再独立试试。"
                : "已保存这一次的独立作答。",
            ),
            btn(
              cursor + 1 === session.items.length
                ? "看看这次的收获"
                : "下一题 →",
              next,
              { className: "edu-primary", disabled: busy },
            ),
          ),
        h("p", { className: "edu-error", role: "alert" }, notice),
        subject === "english" &&
          h("small", null, "朗读使用设备英语声音，不提供口音或发音能力评分。"),
        btn("暂停，回到路线", onBack),
      ),
    );
  }
  function Interest({ session }) {
    const [saved, setSaved] = React.useState(false),
      [error, setError] = React.useState("");
    async function choose(interest) {
      try {
        await store.update((s) => {
          const id = session.id + ":interest";
          s.interests = s.interests.filter((o) => o.id !== id);
          s.interests.push({
            id,
            sessionId: session.id,
            day: localDay(),
            interest,
          });
        });
        setSaved(true);
      } catch (e) {
        setError(e.message);
      }
    }
    return h(
      "aside",
      { className: "edu-coach" },
      h("b", null, "孩子这次的感觉是？"),
      h(
        "div",
        { className: "edu-actions" },
        ...["还想再玩", "刚刚好", "有点累了"].map((s) =>
          btn(s, () => choose(s), { key: s, disabled: saved }),
        ),
      ),
      h(
        "small",
        null,
        saved
          ? "已保存兴趣观察。多看一段时间的变化，不给孩子贴标签。"
          : error || "可以跳过；兴趣和提示需求只作观察。",
      ),
    );
  }
  function Settings({ state, onNavigate }) {
    const [profile, setProfile] = React.useState({ ...state.profile }),
      [notice, setNotice] = React.useState(""),
      [busy, setBusy] = React.useState(false),
      status = store.getStorageStatus();
    React.useEffect(
      () => setProfile({ ...state.profile }),
      [
        state.profile.configuredAt,
        state.profile.edition,
        state.profile.term,
        state.profile.schoolSkill,
      ],
    );
    const save = async () => {
      try {
        await store.update((s) => {
          s.profile = {
            ...s.profile,
            ...profile,
            configuredAt: new Date().toISOString(),
          };
        });
        setNotice("设置已保存；新练习按新进度安排，未完成的练习保留原题。");
      } catch (e) {
        setNotice(e.message);
      }
    };
    async function exportData() {
      const data = store.backup(),
        blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        }),
        url = URL.createObjectURL(blob),
        a = document.createElement("a");
      a.href = url;
      a.download = `mario-learning-${localDay()}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setNotice("备份已导出，包含学习证据和原有宠物、星星、签到数据。");
    }
    async function importData(e) {
      const file = e.target.files[0];
      if (!file) return;
      try {
        if (file.size > 15000000) throw Error("文件过大，请检查是否为学习备份");
        const restored = await store.importBackup(
          JSON.parse(await file.text()),
        );
        setNotice(
          "备份已合并，不覆盖本机已有设置和记录。" +
            (restored ? "原有宠物数据已恢复，刷新页面后显示。" : ""),
        );
      } catch (error) {
        setNotice(error.message);
      }
      e.target.value = "";
    }
    async function refresh() {
      setBusy(true);
      try {
        const result = await store.refreshCatalog();
        setNotice(
          result.offline
            ? "暂时无法检查更新，继续使用已保存的课程。" + (result.error || "")
            : result.updated
              ? "已载入校验通过的新内容包。"
              : "当前已是发布的最新内容包。",
        );
      } catch (e) {
        setNotice(e.message);
      } finally {
        setBusy(false);
      }
    }
    const math = state.catalog.skills.filter(
      (s) =>
        s.subject === "math" &&
        s.track !== "foundation" &&
        s.term <= profile.term,
    );
    return h(
      "div",
      null,
      h(
        Heading,
        { title: "家长设置", kicker: "跟随学校进度，也看见孩子的节奏" },
        h(
          "p",
          null,
          "先对照孩子实际课本，再选择课堂主题。选择进度不等于确认掌握。",
        ),
      ),
      h(
        "section",
        { className: "edu-card edu-settings" },
        h("h3", null, "一年级学习档案"),
        h("p", null, "数学 / 语文出版信息：江苏凤凰教育出版社（家长提供）"),
        h("p", { className: "edu-note" }, state.catalog.textbookNote),
        h(
          "label",
          null,
          "教材版次备注",
          h("input", {
            value: profile.edition,
            maxLength: 80,
            onChange: (e) =>
              setProfile({ ...profile, edition: e.target.value }),
          }),
        ),
        h(
          "label",
          null,
          "当前学期",
          h(
            "select",
            {
              value: profile.term,
              onChange: (e) => {
                const term = Number(e.target.value);
                setProfile({
                  ...profile,
                  term,
                  schoolSkill:
                    term === 1 &&
                    state.catalog.skills.find(
                      (s) => s.id === profile.schoolSkill,
                    )?.term === 2
                      ? "m-add10"
                      : profile.schoolSkill,
                });
              },
            },
            h("option", { value: 1 }, "一年级上学期"),
            h("option", { value: 2 }, "一年级下学期"),
          ),
        ),
        h(
          "label",
          null,
          "数学课堂正在学习",
          h(
            "select",
            {
              value: profile.schoolSkill,
              onChange: (e) =>
                setProfile({ ...profile, schoolSkill: e.target.value }),
            },
            ...math.map((s) =>
              h("option", { value: s.id, key: s.id }, s.title),
            ),
          ),
        ),
        h(
          "p",
          null,
          "英语：尚未开课，按零基础视听说启蒙；可以在成长路线中换主题。",
        ),
        h(
          "label",
          null,
          h("input", {
            type: "checkbox",
            checked: profile.preview,
            onChange: (e) =>
              setProfile({ ...profile, preview: e.target.checked }),
          }),
          "愿意尝试下学期内容（仍需满足每个主题的前置掌握证据）",
        ),
        h(
          "label",
          null,
          h("input", {
            type: "checkbox",
            checked: profile.autoReadQuestions !== false,
            onChange: (e) =>
              setProfile({ ...profile, autoReadQuestions: e.target.checked }),
          }),
          "每道题自动语音播报（包含提示与提交后的讲解）",
        ),
        btn("保存学习设置", save, { className: "edu-primary" }),
      ),
      h(
        "section",
        { className: "edu-card" },
        h("h3", null, "记录与备份"),
        h(
          "p",
          null,
          status.mode === "indexeddb"
            ? "学习记录保存在本设备 IndexedDB。"
            : "当前使用" +
                (status.mode === "memory" ? "临时内存" : "本设备备用存储") +
                "。",
        ),
        h(
          "p",
          null,
          "本版没有云端账号或跨设备同步。清理网站数据或换设备前请导出；浏览器存储仍可能被系统清除。",
        ),
        h("p", { className: "edu-error" }, status.error),
        h(
          "div",
          { className: "edu-actions" },
          btn("导出完整备份", exportData),
          h(
            "label",
            { className: "edu-file-button" },
            "合并导入备份",
            h("input", {
              type: "file",
              accept: ".json,application/json",
              onChange: importData,
            }),
          ),
        ),
      ),
      h(
        "section",
        { className: "edu-card" },
        h("h3", null, "课程内容与来源"),
        h(
          "p",
          null,
          `内容版本 ${state.catalog.version} · 资料核对 ${state.catalog.checkedAt}`,
        ),
        h(
          "p",
          null,
          "本地任务随作答、提示和复习需要变化。打开应用或点击按钮检查本站发布的内容包；校验失败或离线时保留旧版。网上资料进入课程前仍需核验和发布。",
        ),
        h("p", null, state.catalog.review.note),
        btn(busy ? "正在检查…" : "检查课程更新", refresh, { disabled: busy }),
        h(
          "ul",
          null,
          ...state.catalog.sources.map((s) =>
            h(
              "li",
              { key: s.id },
              h(
                "a",
                { href: s.url, target: "_blank", rel: "noreferrer" },
                s.title,
              ),
              h("small", null, s.evidence),
            ),
          ),
        ),
      ),
      h(
        "section",
        { className: "edu-card" },
        h("h3", null, "学习证据"),
        h(
          "p",
          null,
          `${state.attempts.length} 条作答 · ${state.interests.length} 条兴趣观察 · ${Object.keys(state.habits).length} 天习惯记录`,
        ),
        ...state.interests
          .slice(-5)
          .reverse()
          .map((o) => h("p", { key: o.id }, o.day + " · " + o.interest)),
        h(
          "p",
          null,
          "不根据做题速度判断天赋。结合兴趣、主动尝试和策略变化，长期观察。",
        ),
        btn("查看各知识点记录", () => onNavigate("roadmap")),
      ),
      h("p", { className: "edu-notice", role: "status" }, notice),
    );
  }
  function LearningPage({ section, onComplete, onNavigate }) {
    const { state, error } = useLearning(),
      [preferred, setPreferred] = React.useState(null),
      [practiceSubject, setPracticeSubject] = React.useState(null);
    React.useEffect(() => {
      setPreferred(null);
      setPracticeSubject(null);
    }, [section]);
    if (!state.catalog) return h(Loading, { error });
    async function choose(s) {
      if (!s) return;
      if (s.subject === "thinking") {
        try {
          await store.update((state) => {
            state.profile.thinkingSkill = s.id;
          });
        } catch {}
      }
      setPreferred(s.id);
      setPracticeSubject(s.subject);
    }
    if (section === "learning-settings")
      return h(
        "div",
        { className: "edu-page" },
        h(StorageNotice),
        h(Settings, { state, onNavigate }),
      );
    if (section === "roadmap" && !practiceSubject)
      return h(
        "div",
        { className: "edu-page" },
        h(StorageNotice),
        h(Roadmap, {
          state,
          onPractice: choose,
        }),
        h(Habits, { state, onComplete }),
      );
    if (section === "thinking" && !practiceSubject)
      return h(
        "div",
        { className: "edu-page" },
        h(StorageNotice),
        h(ThinkingHub, { state, onPractice: choose, onNavigate }),
      );
    return h(
      "div",
      { className: "edu-page" },
      h(StorageNotice),
      h(Practice, {
        key: (practiceSubject || section) + ":" + (preferred || ""),
        subject: practiceSubject || section,
        state,
        preferred,
        onComplete,
        onChoose: choose,
        onBack: () => {
          setPracticeSubject(null);
          setPreferred(null);
          onNavigate(section === "thinking" ? "thinking" : "roadmap");
        },
      }),
    );
  }
  return { LearningDashboard, LearningPage };
}
