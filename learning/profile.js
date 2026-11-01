export const GRADE_NAMES = [
  "",
  "一年级",
  "二年级",
  "三年级",
  "四年级",
  "五年级",
  "六年级",
];
export const PROGRESSION_DEFAULTS = {
  progressionMode: "auto",
  entryYear: 2026,
  grade: 1,
  term: 1,
  englishLevel: 1,
};
export function learningContext(profile = {}, day) {
  const date =
    day ||
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  const [year, month] = date.split("-").map(Number);
  const entryYear = Number.isInteger(profile.entryYear)
    ? profile.entryYear
    : 2026;
  const manual = profile.progressionMode === "manual";
  const schoolYear = month >= 9 ? year : year - 1;
  const enrolled = Math.max(1, schoolYear - entryYear + 1);
  const summer =
    !manual &&
    enrolled < 6 &&
    month >= 7 &&
    month <= 8 &&
    year >= entryYear + 1;
  const grade = manual
    ? Math.max(1, Math.min(6, profile.grade || 1))
    : Math.max(1, Math.min(6, enrolled + (summer ? 1 : 0)));
  const term = manual
    ? profile.term === 2
      ? 2
      : 1
    : month >= 2 && month <= 6
      ? 2
      : 1;
  const beforeEntry =
    (!manual && year < entryYear) ||
    (!manual && year === entryYear && month < 9);
  const graduated =
    !manual && (enrolled > 6 || (enrolled === 6 && month >= 7 && month <= 8));
  return {
    grade,
    term: beforeEntry ? 1 : term,
    summer,
    enrolledGrade: Math.min(6, enrolled),
    beforeEntry,
    graduated,
    label:
      GRADE_NAMES[grade] +
      (graduated
        ? "之后 · 保留小学复习"
        : beforeEntry
          ? "入学准备"
          : summer
            ? "暑期预习"
            : term === 1
              ? "上学期"
              : "下学期"),
    mode: manual ? "manual" : "auto",
  };
}
export function effectiveProfile(profile, day) {
  const context = learningContext(profile, day);
  return { ...profile, grade: context.grade, term: context.term, context };
}
export function validateProgression(profile) {
  // Optional fields allow v1 backups created before grade progression.
  if (
    profile.progressionMode !== undefined &&
    !["auto", "manual"].includes(profile.progressionMode)
  )
    throw Error("年级推算方式无效");
  if (
    profile.entryYear !== undefined &&
    (!Number.isInteger(profile.entryYear) ||
      profile.entryYear < 2000 ||
      profile.entryYear > 2100)
  )
    throw Error("入学年份无效");
  if (
    profile.grade !== undefined &&
    (!Number.isInteger(profile.grade) || profile.grade < 1 || profile.grade > 6)
  )
    throw Error("年级需为小学一至六年级");
  if (
    profile.englishLevel !== undefined &&
    ![1, 2, 3].includes(profile.englishLevel)
  )
    throw Error("英语起点无效");
  return profile;
}
