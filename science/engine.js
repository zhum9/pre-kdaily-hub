export const STAGES = ["理解现象", "证据推理", "设计探究"];
export const OBSERVATION_STATUS = {
  planned: "还没动手，先保存计划",
  observed: "已经观察到现象",
  different: "结果和预测不同",
  unclear: "已经尝试，还没看清",
};
const object = (v) => v && typeof v === "object" && !Array.isArray(v);
const text = (v) =>
  typeof v === "string" && v.trim().length > 0 && v.length <= 6000;
const unique = (list) => new Set(list).size === list.length;
const clone = (v) => JSON.parse(JSON.stringify(v));
function assert(ok, message) {
  if (!ok) throw Error(message);
}
function sourceValid(source) {
  if (
    !source ||
    !text(source.id) ||
    !text(source.title) ||
    !text(source.checkedAt)
  )
    return false;
  try {
    const url = new URL(source.url);
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      [
        "si.edu",
        "scienceworld.ca",
        "sciencebuddies.org",
        "usgs.gov",
        "acs.org",
        "illinois.edu",
        "thyssenkrupp-materials.co.uk",
        "noaa.gov",
        "nasa.gov",
      ].some(
        (host) => url.hostname === host || url.hostname.endsWith("." + host),
      )
    );
  } catch {
    return false;
  }
}
function checkValid(q) {
  return (
    q &&
    text(q.id) &&
    text(q.prompt) &&
    text(q.explanation) &&
    Array.isArray(q.choices) &&
    q.choices.length === 3 &&
    q.choices.every(text) &&
    unique(q.choices) &&
    q.choices.includes(q.correct) &&
    (!q.table ||
      (q.table.label === "练习用示例记录，不是孩子实测" &&
        Array.isArray(q.table.columns) &&
        q.table.columns.length >= 2 &&
        q.table.columns.length <= 5 &&
        q.table.columns.every(text) &&
        Array.isArray(q.table.rows) &&
        q.table.rows.length >= 2 &&
        q.table.rows.length <= 10 &&
        q.table.rows.every(
          (row) =>
            Array.isArray(row) &&
            row.length === q.table.columns.length &&
            row.every(text),
        )))
  );
}
function lessonValid(lesson) {
  return (
    lesson &&
    text(lesson.id) &&
    [1, 2, 3].includes(lesson.level) &&
    ["title", "inquiry", "explanation", "mission"].every((key) =>
      text(lesson[key]),
    ) &&
    Array.isArray(lesson.checks) &&
    lesson.checks.length === 2 &&
    lesson.checks.every(checkValid) &&
    unique(lesson.checks.map((q) => q.id))
  );
}
function activityValid(a) {
  return (
    a &&
    ["title", "time", "materials", "safety", "changed", "kept"].every((key) =>
      text(a[key]),
    ) &&
    Array.isArray(a.steps) &&
    a.steps.length >= 3 &&
    a.steps.every(text)
  );
}
export function validateScienceCatalog(catalog) {
  assert(
    catalog?.schemaVersion === 1 &&
      text(catalog.version) &&
      text(catalog.publishedAt),
    "科普内容包格式不正确",
  );
  assert(
    Array.isArray(catalog.sources) &&
      catalog.sources.length > 0 &&
      catalog.sources.every(sourceValid) &&
      unique(catalog.sources.map((s) => s.id)),
    "科普来源不完整",
  );
  assert(
    Array.isArray(catalog.topics) &&
      catalog.topics.length >= 1 &&
      catalog.topics.length <= 80 &&
      unique(catalog.topics.map((t) => t.id)),
    "科普主题不完整",
  );
  const ids = new Set();
  for (const topic of catalog.topics) {
    assert(
      [
        "id",
        "title",
        "icon",
        "area",
        "tagline",
        "prediction",
        "misconception",
      ].every((key) => text(topic[key])),
      "科普主题字段缺失",
    );
    assert(
      Array.isArray(topic.sources) &&
        topic.sources.length > 0 &&
        topic.sources.every((id) => catalog.sources.some((s) => s.id === id)),
      "科普来源引用无效",
    );
    assert(
      activityValid(topic.activity) &&
        Array.isArray(topic.levels) &&
        topic.levels.length === 3 &&
        topic.levels.every(lessonValid) &&
        topic.levels.every((l, i) => l.level === i + 1),
      "科普层级或探究步骤不完整",
    );
    for (const lesson of topic.levels) {
      assert(!ids.has(lesson.id), "科普课程编号重复");
      ids.add(lesson.id);
    }
  }
  return catalog;
}
export const emptyScience = () => ({
  catalog: null,
  sessions: {},
  observations: {},
});
export function validateScienceState(state) {
  assert(
    object(state) && object(state.sessions) && object(state.observations),
    "科普记录格式不正确",
  );
  if (state.catalog) validateScienceCatalog(state.catalog);
  assert(
    Object.keys(state.sessions).length <= 20000 &&
      Object.keys(state.observations).length <= 50000,
    "科普记录过多",
  );
  for (const [id, run] of Object.entries(state.sessions)) {
    assert(
      run &&
        run.id === id &&
        text(run.topicId) &&
        text(run.topicTitle) &&
        text(run.version) &&
        lessonValid(run.lesson) &&
        run.lessonId === run.lesson.id &&
        activityValid(run.activity) &&
        text(run.predictionPrompt) &&
        text(run.misconception) &&
        text(run.startedAt) &&
        [null, "change", "same", "unsure"].includes(run.prediction) &&
        object(run.answers) &&
        Array.isArray(run.sourceRefs) &&
        run.sourceRefs.length > 0 &&
        run.sourceRefs.every(sourceValid),
      "科普课次快照不完整",
    );
    for (const [key, answer] of Object.entries(run.answers)) {
      const question = run.lesson.checks.find((q) => q.id === key);
      assert(
        question &&
          question.choices.includes(answer?.value) &&
          typeof answer.correct === "boolean" &&
          answer.correct === (answer.value === question.correct) &&
          text(answer.at),
        "科普作答记录无效",
      );
    }
    assert(
      !run.finishedAt ||
        (text(run.finishedAt) &&
          run.lesson.checks.every((q) => run.answers[q.id])),
      "科普完成记录缺少作答",
    );
  }
  for (const [id, entry] of Object.entries(state.observations))
    assert(
      entry?.id === id &&
        text(entry.lessonId) &&
        text(entry.sessionId) &&
        Object.hasOwn(OBSERVATION_STATUS, entry.status) &&
        typeof entry.note === "string" &&
        entry.note.length <= 2000 &&
        text(entry.at) &&
        state.sessions[entry.sessionId]?.lessonId === entry.lessonId,
      "科普观察记录无效",
    );
  return state;
}
function random(seed) {
  let value = 2166136261;
  for (const char of String(seed))
    value = Math.imul(value ^ char.charCodeAt(0), 16777619);
  return () => {
    value += 0x6d2b79f5;
    let n = Math.imul(value ^ (value >>> 15), 1 | value);
    n ^= n + Math.imul(n ^ (n >>> 7), 61 | n);
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
  };
}
export function makeScienceSession(
  catalog,
  lessonId,
  id,
  at = new Date().toISOString(),
) {
  validateScienceCatalog(catalog);
  const topic = catalog.topics.find((t) =>
    t.levels.some((l) => l.id === lessonId),
  );
  assert(topic && text(id), "找不到这节探索课");
  const lesson = clone(topic.levels.find((l) => l.id === lessonId)),
    rng = random(id);
  for (const q of lesson.checks) {
    for (let i = q.choices.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [q.choices[i], q.choices[j]] = [q.choices[j], q.choices[i]];
    }
  }
  return {
    id,
    lessonId,
    topicId: topic.id,
    topicTitle: topic.title,
    version: catalog.version,
    lesson,
    activity: clone(topic.activity),
    predictionPrompt: topic.prediction,
    misconception: topic.misconception,
    sourceRefs: clone(
      catalog.sources.filter((s) => topic.sources.includes(s.id)),
    ),
    startedAt: at,
    prediction: null,
    answers: {},
    finishedAt: null,
  };
}
export function scienceSpeech(question) {
  const table = question.table;
  let prompt = question.prompt;
  if (table)
    prompt +=
      "。" +
      table.label +
      "。" +
      table.rows
        .map((row) =>
          row.map((cell, i) => table.columns[i] + "，" + cell).join("；"),
        )
        .join("。 ");
  return { ...question, prompt };
}
export function nextScienceLesson(catalog, sessions, preferredLevel = 1) {
  const finished = new Set(
    Object.values(sessions)
      .filter((s) => s.finishedAt)
      .map((s) => s.lessonId),
  );
  // Rotate subjects before repeating a completed lesson; level is selected explicitly.
  const order = [
    preferredLevel - 1,
    ...[0, 1, 2].filter((i) => i !== preferredLevel - 1),
  ];
  const lessons = order.flatMap((i) => catalog.topics.map((t) => t.levels[i]));
  return lessons.find((l) => !finished.has(l.id)) || lessons[0];
}
