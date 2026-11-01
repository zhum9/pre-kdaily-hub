import * as store from "../learning/store.js?v=31";
import { refreshScience } from "./data.js?v=31";
import {
  STAGES,
  OBSERVATION_STATUS,
  emptyScience,
  makeScienceSession,
  nextScienceLesson,
  scienceSpeech,
} from "./engine.js?v=31";
import {
  createSpeechReader,
  questionSpeech,
  spokenText,
  speechErrorMessage,
} from "../learning/audio.js?v=31";
import { learningContext } from "../learning/profile.js?v=31";
let bootstrap;
export function createSciencePage(React) {
  const h = React.createElement;
  const button = (label, onClick, props = {}) =>
    h("button", { type: "button", onClick, ...props }, label);
  function useNarration(segments, key, automatic) {
    const reader = React.useMemo(() => createSpeechReader(), []);
    const [status, setStatus] = React.useState("idle"),
      [error, setError] = React.useState("");
    const say = (parts = segments) => {
      setError("");
      return reader.read(parts, {
        onStatus: setStatus,
        onError: (code) => setError(speechErrorMessage(code)),
      });
    };
    React.useEffect(() => {
      if (automatic) say();
      else {
        reader.stop();
        setStatus("idle");
      }
      return () => reader.stop();
    }, [key, automatic]);
    return {
      say,
      stop: () => {
        reader.stop();
        setStatus("idle");
      },
      status,
      error,
    };
  }
  function Voice({ audio, automatic }) {
    return h(
      "div",
      { className: "sci-voice" },
      button("🔊 重播读题", () => audio.say()),
      button("停止朗读", audio.stop),
      h(
        "label",
        null,
        h("input", {
          type: "checkbox",
          checked: automatic,
          onChange: (e) =>
            store.update((s) => {
              s.profile.autoReadQuestions = e.target.checked;
            }),
        }),
        "自动读题",
      ),
      h(
        "span",
        { role: "status" },
        audio.error ||
          (["speaking", "loading"].includes(audio.status) ? "正在朗读…" : ""),
      ),
    );
  }
  function Sources({ sources, version }) {
    return h(
      "details",
      { className: "sci-sources" },
      h("summary", null, "资料来源与内容版本"),
      h(
        "p",
        null,
        `内容版本 ${version} · 原创中文活动与问题，依据以下资料核对。示例记录为练习编写，并非资料中的实测或孩子实测。`,
      ),
      h(
        "ul",
        null,
        ...sources.map((source) =>
          h(
            "li",
            { key: source.id },
            h(
              "a",
              {
                href: source.url,
                target: "_blank",
                rel: "noopener noreferrer",
              },
              source.title,
            ),
            ` · 核对 ${source.checkedAt}`,
          ),
        ),
      ),
    );
  }
  function Hub({
    data,
    profile,
    onChoose,
    onResume,
    error,
    onRefresh,
    refreshing,
  }) {
    const [area, setArea] = React.useState("全部"),
      context = learningContext(profile);
    const catalog = data.catalog,
      runs = Object.values(data.sessions);
    const complete = new Set(
      runs.filter((s) => s.finishedAt).map((s) => s.lessonId),
    );
    const observed = new Set(
      Object.values(data.observations)
        .filter((e) => e.status !== "planned")
        .map((e) => e.lessonId),
    );
    const resume = runs
      .filter((s) => !s.finishedAt)
      .sort((a, b) => b.startedAt.localeCompare(a.startedAt))[0];
    const recommendedLevel = Math.min(
      3,
      Math.max(1, Math.ceil(context.grade / 2)),
    );
    const suggested = nextScienceLesson(
      catalog,
      data.sessions,
      recommendedLevel,
    );
    return h(
      "div",
      null,
      h(
        "header",
        { className: "sci-hero" },
        h("small", null, "MARIO SCIENCE · 观察 / 证据 / 解释"),
        h("h2", null, "小小科学研究所"),
        h("p", null, "不只记住为什么，还要问：怎么知道？还有别的解释吗？"),
        h(
          "div",
          { className: "sci-stats" },
          h("span", null, `${catalog.topics.length} 个主题`),
          h(
            "span",
            null,
            `${catalog.topics.flatMap((t) => t.levels).length} 节分层探索`,
          ),
          h("span", null, `${complete.size} 节已完成思考`),
          h("span", null, `${observed.size} 节有动手记录`),
        ),
      ),
      h(
        "section",
        { className: "edu-card sci-guide" },
        h("h3", null, "按理解程度选层，不按签到升级"),
        h(
          "p",
          null,
          `${context.label}：建议先看第 ${recommendedLevel} 层，随时可以改选。第 1 层理解现象；第 2 层读记录、找证据；第 3 层设计比较、检查结论。高年级可增加独立记录与口头报告，主题不是教材逐课替代。`,
        ),
        resume
          ? button(
              `继续探索：${resume.topicTitle} · ${STAGES[resume.lesson.level - 1]}`,
              () => onResume(resume.id),
              { className: "edu-primary" },
            )
          : button(
              `试试下一节：${suggested.title}`,
              () => onChoose(suggested.id),
              { className: "edu-primary" },
            ),
        button(refreshing ? "正在检查更新…" : "检查科普内容更新", onRefresh, {
          disabled: refreshing,
        }),
        error && h("p", { role: "status", className: "edu-notice" }, error),
      ),
      h(
        "div",
        { className: "sci-filters", role: "group", "aria-label": "科普领域" },
        ...["全部", ...new Set(catalog.topics.map((t) => t.area))].map(
          (value) =>
            button(value, () => setArea(value), {
              key: value,
              "aria-pressed": area === value,
            }),
        ),
      ),
      h(
        "div",
        { className: "sci-topics" },
        ...catalog.topics
          .filter((t) => area === "全部" || area === t.area)
          .map((topic) =>
            h(
              "article",
              { className: "sci-topic", key: topic.id },
              h(
                "div",
                { className: "sci-topic-icon", "aria-hidden": true },
                topic.icon,
              ),
              h("small", null, topic.area),
              h("h3", null, topic.title),
              h("p", null, topic.tagline),
              h(
                "div",
                { className: "sci-levels" },
                ...topic.levels.map((lesson) =>
                  button(
                    `${lesson.level} · ${STAGES[lesson.level - 1]}${complete.has(lesson.id) ? " ✓" : ""}`,
                    () => onChoose(lesson.id),
                    {
                      key: lesson.id,
                      "aria-label": `${topic.title} ${STAGES[lesson.level - 1]}`,
                      className:
                        lesson.level === recommendedLevel
                          ? "sci-recommended"
                          : "",
                    },
                  ),
                ),
              ),
              h("small", null, topic.levels.map((l) => l.title).join(" → ")),
            ),
          ),
      ),
      h(Sources, { sources: catalog.sources, version: catalog.version }),
    );
  }
  function Evidence({ table }) {
    return h(
      "figure",
      { className: "sci-evidence" },
      h("figcaption", null, table.label),
      h(
        "div",
        { className: "sci-table-scroll" },
        h(
          "table",
          null,
          h(
            "thead",
            null,
            h(
              "tr",
              null,
              ...table.columns.map((cell, i) =>
                h("th", { key: i, scope: "col" }, cell),
              ),
            ),
          ),
          h(
            "tbody",
            null,
            ...table.rows.map((row, r) =>
              h(
                "tr",
                { key: r },
                ...row.map((cell, c) =>
                  h(
                    c ? "td" : "th",
                    { key: c, ...(c ? {} : { scope: "row" }) },
                    cell,
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
  function Lesson({ run, data, profile, onBack, onComplete, onNew }) {
    const firstUnanswered = run.lesson.checks.findIndex(
      (q) => !run.answers[q.id],
    );
    const [index, setIndex] = React.useState(
        firstUnanswered < 0 ? 1 : firstUnanswered,
      ),
      [choice, setChoice] = React.useState("");
    const prior = Object.values(data.observations)
      .filter((o) => o.sessionId === run.id)
      .sort((a, b) => b.at.localeCompare(a.at))[0];
    const [observation, setObservation] = React.useState(
        prior?.status || "planned",
      ),
      [note, setNote] = React.useState(prior?.note || "");
    const [notice, setNotice] = React.useState(""),
      [busy, setBusy] = React.useState(false);
    const q = run.lesson.checks[index],
      answer = run.answers[q.id],
      automatic = profile.autoReadQuestions !== false;
    const predictionChoices = [
      ["change", "我猜会变化"],
      ["same", "我猜不会变化"],
      ["unsure", "暂时不确定"],
    ];
    const segments = !run.prediction
      ? [
          {
            text: `${run.predictionPrompt}。可以选：我猜会变化、我猜不会变化，或者暂时不确定。先作预测，没有对错分数。`,
            lang: "zh-CN",
          },
        ]
      : answer
        ? [
            {
              text:
                (answer.correct ? "这次选择符合证据。" : "我们一起检查理由。") +
                q.explanation,
              lang: "zh-CN",
            },
          ]
        : questionSpeech(scienceSpeech(q));
    const audio = useNarration(
      segments,
      `${run.id}:${run.prediction}:${index}:${answer?.at || "new"}`,
      automatic,
    );
    const attempted = run.lesson.checks.every((check) => run.answers[check.id]);
    const speakText = (value) =>
      audio.say([{ text: spokenText(value), lang: "zh-CN" }]);
    async function save(mutator) {
      if (busy) return;
      setBusy(true);
      setNotice("");
      try {
        await store.update(mutator);
      } catch (e) {
        setNotice("保存失败：" + e.message);
      } finally {
        setBusy(false);
      }
    }
    async function finish() {
      if (busy) return;
      const at = new Date().toISOString(),
        id = crypto.randomUUID();
      const wasFinished = !!run.finishedAt;
      await save((state) => {
        const target = state.science.sessions[run.id];
        state.science.observations[id] = {
          id,
          lessonId: run.lessonId,
          sessionId: run.id,
          status: observation,
          note: note.trim(),
          at,
        };
        target.finishedAt ||= at;
      });
      if (store.getSnapshot().science.observations[id]) {
        setNotice(
          observation === "planned"
            ? "思考记录已保存；实验仍记为未动手，之后可以补充。"
            : "观察记录已保存，结果不同也值得研究。 ",
        );
        if (!wasFinished) onComplete?.("science", 3);
      }
    }
    return h(
      "article",
      { className: "sci-lesson" },
      h(
        "div",
        { className: "sci-back" },
        button("返回探索主题", onBack),
        h(
          "small",
          null,
          `第 ${run.lesson.level} 层 · ${STAGES[run.lesson.level - 1]} · 不计时`,
        ),
      ),
      h(
        "header",
        { className: "edu-heading" },
        h(
          "div",
          null,
          h(
            "h2",
            { tabIndex: -1, className: "sci-lesson-title" },
            `${run.topicTitle} · ${run.lesson.title}`,
          ),
          h("p", null, run.lesson.inquiry),
        ),
      ),
      h(Voice, { audio, automatic }),
      h(
        "section",
        { className: "edu-card sci-prediction" },
        h("h3", null, "先作预测"),
        h("p", null, run.predictionPrompt),
        run.prediction
          ? h(
              "p",
              null,
              "我的预测：" +
                predictionChoices.find(([id]) => id === run.prediction)?.[1] +
                "。预测不是考试，可以被证据修正。",
            )
          : h(
              "div",
              { className: "sci-choice-row" },
              ...predictionChoices.map(([id, label]) =>
                button(
                  label,
                  () =>
                    save((s) => {
                      s.science.sessions[run.id].prediction = id;
                    }),
                  { key: id, disabled: busy },
                ),
              ),
            ),
      ),
      run.prediction &&
        h(
          React.Fragment,
          null,
          h(
            "section",
            { className: "edu-card sci-idea" },
            h("h3", null, "理解一点，再往深处想"),
            h("p", null, run.lesson.explanation),
            h(
              "p",
              { className: "sci-misconception" },
              "容易混淆：" + run.misconception,
            ),
            h(
              "p",
              { className: "sci-mission" },
              "本层任务：" + run.lesson.mission,
            ),
            button("🔊 听讲解与任务", () =>
              speakText(
                run.lesson.explanation +
                  "。容易混淆：" +
                  run.misconception +
                  "。本层任务：" +
                  run.lesson.mission,
              ),
            ),
          ),
          h(
            "section",
            { className: "edu-card sci-question", "aria-label": "科学思考题" },
            h(
              "small",
              null,
              `挑战 ${index + 1} / 2 · ${q.table ? "读证据" : "说理由"}`,
            ),
            h("h3", null, q.prompt),
            q.table && h(Evidence, { table: q.table }),
            h(
              "div",
              {
                className: "sci-answers",
                role: "radiogroup",
                "aria-label": "我的选择",
              },
              ...q.choices.map((value, i) =>
                button(value, () => setChoice(value), {
                  key: value,
                  role: "radio",
                  "aria-checked": (answer?.value || choice) === value,
                  disabled: !!answer || busy,
                  className:
                    (answer?.value || choice) === value ? "sci-selected" : "",
                  "data-choice": i,
                }),
              ),
            ),
            !answer
              ? button(
                  "提交答案",
                  () =>
                    save((s) => {
                      s.science.sessions[run.id].answers[q.id] = {
                        value: choice,
                        correct: choice === q.correct,
                        at: new Date().toISOString(),
                      };
                    }),
                  { disabled: !choice || busy, className: "edu-primary" },
                )
              : h(
                  "div",
                  { className: "sci-feedback", role: "status" },
                  h(
                    "strong",
                    null,
                    answer.correct ? "这次选择符合证据" : "我们一起检查理由",
                  ),
                  h("p", null, q.explanation),
                  !answer.correct &&
                    h("p", null, "更有依据的选择：" + q.correct),
                  index === 0 &&
                    button(
                      "下一道挑战",
                      () => {
                        setIndex(1);
                        setChoice("");
                        document
                          .querySelector(".sci-question")
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          });
                      },
                      { className: "edu-primary" },
                    ),
                ),
          ),
          h(
            "section",
            { className: "edu-card sci-lab" },
            h("h3", null, "动手探究 · " + run.activity.title),
            h("p", null, `${run.activity.time} · 家长陪伴`),
            h("p", null, "准备：" + run.activity.materials),
            h(
              "ol",
              null,
              ...run.activity.steps.map((step, i) => h("li", { key: i }, step)),
            ),
            h(
              "dl",
              null,
              h(
                "dt",
                null,
                run.topicId === "web" || run.topicId === "weather"
                  ? "自然观察"
                  : "主要改变",
              ),
              h("dd", null, run.activity.changed),
              h("dt", null, "尽量保持"),
              h("dd", null, run.activity.kept),
            ),
            h("p", { className: "sci-safety" }, run.activity.safety),
            button("🔊 听材料与操作步骤", () =>
              speakText(
                `${run.activity.title}。准备：${run.activity.materials}。${run.activity.steps.join("。 ")}。主要变化：${run.activity.changed}。尽量保持：${run.activity.kept}。${run.activity.safety}`,
              ),
            ),
          ),
          attempted &&
            h(
              "section",
              { className: "edu-card sci-observation" },
              h("h3", null, "记录真实观察"),
              h(
                "p",
                null,
                "前面的表格是练习示例。这里记录你自己做的情况；还没做也可以诚实保存。家长可代笔。",
              ),
              h(
                "fieldset",
                null,
                h("legend", null, "这次动手情况"),
                ...Object.entries(OBSERVATION_STATUS).map(([value, label]) =>
                  h(
                    "label",
                    { key: value },
                    h("input", {
                      type: "radio",
                      name: "observation",
                      value,
                      checked: observation === value,
                      onChange: () => setObservation(value),
                    }),
                    label,
                  ),
                ),
              ),
              h(
                "label",
                { className: "sci-note" },
                "我的观察或下次计划（选填）",
                h("textarea", {
                  value: note,
                  maxLength: 2000,
                  rows: 3,
                  onChange: (e) => setNote(e.target.value),
                  placeholder:
                    "发生了什么？改了什么条件？还有什么不确定？保存后会保留。",
                }),
              ),
              button(
                run.finishedAt ? "补充保存观察记录" : "保存记录并完成本节思考",
                finish,
                { disabled: busy, className: "edu-primary" },
              ),
              h(
                "p",
                { role: "status" },
                notice ||
                  (run.finishedAt
                    ? "本节思考已保存。完成思考不等于实验已验证或已经掌握。"
                    : ""),
              ),
              run.finishedAt && button("再探索一次", () => onNew(run.lessonId)),
            ),
          notice && !attempted && h("p", { role: "status" }, notice),
        ),
      h(Sources, { sources: run.sourceRefs, version: run.version }),
    );
  }
  return function SciencePage({ onComplete }) {
    const state = React.useSyncExternalStore(
      store.subscribe,
      store.getSnapshot,
      store.getSnapshot,
    );
    const [error, setError] = React.useState(""),
      [activeId, setActiveId] = React.useState(null),
      [refreshing, setRefreshing] = React.useState(false);
    React.useEffect(() => {
      bootstrap ||= store.initialize().then(() => refreshScience());
      bootstrap
        .then((result) => {
          if (result?.offline)
            setError("目前使用已保存的科普内容：" + result.error);
        })
        .catch((e) => setError(e.message));
    }, []);
    const data = state.science || emptyScience();
    const storage = store.getStorageStatus();
    async function refresh() {
      setRefreshing(true);
      setError("");
      try {
        const result = await refreshScience();
        setError(
          result.offline
            ? "更新未成功，继续使用已保存内容：" + result.error
            : result.updated
              ? "科普内容已更新，历史记录与正在探索的题目保留。"
              : "科普内容已经是当前发布版本。",
        );
      } catch (e) {
        setError(e.message);
        bootstrap = null;
      } finally {
        setRefreshing(false);
      }
    }
    const resume = (id) => {
      setActiveId(id);
      window.scrollTo({ top: 0 });
    };
    async function choose(lessonId, force = false) {
      const old =
        !force &&
        Object.values(data.sessions).find(
          (s) => s.lessonId === lessonId && !s.finishedAt,
        );
      if (old) return resume(old.id);
      try {
        const id = crypto.randomUUID(),
          run = makeScienceSession(data.catalog, lessonId, id);
        await store.update((s) => {
          s.science ||= emptyScience();
          s.science.sessions[id] = run;
        });
        resume(id);
      } catch (e) {
        setError(e.message);
      }
    }
    if (!data.catalog)
      return h(
        "div",
        { className: "edu-page edu-card", role: "status" },
        error || "正在读取探索课程…",
        error && button("重新读取科普内容", refresh),
      );
    const run = data.sessions[activeId];
    return h(
      "div",
      { className: "edu-page sci-page" },
      storage.error &&
        h("p", { className: "edu-notice", role: "status" }, storage.error),
      run
        ? h(Lesson, {
            key: run.id,
            run,
            data,
            profile: state.profile,
            onBack: () => setActiveId(null),
            onComplete,
            onNew: (id) => choose(id, true),
          })
        : h(Hub, {
            data,
            profile: state.profile,
            onChoose: choose,
            onResume: resume,
            error,
            onRefresh: refresh,
            refreshing,
          }),
    );
  };
}
