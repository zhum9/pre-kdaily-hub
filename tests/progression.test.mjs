import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { learningContext, validateProgression } from "../learning/profile.js";
import {
  validateCatalog,
  makeItem,
  makeSession,
  isCorrect,
  plan,
  DEFAULT_PROFILE,
} from "../learning/engine.js";
const catalog = JSON.parse(
  await readFile(
    new URL("../content/catalog-2026.11.01-growth.json", import.meta.url),
  ),
);
const state = (grade, term = 1) => ({
  profile: {
    ...DEFAULT_PROFILE,
    progressionMode: "manual",
    grade,
    term,
    schoolSkill: "auto",
  },
  attempts: [],
  sessions: {},
});
test("Shanghai grade calendar handles entry, summer preview, September and parent overrides", () => {
  for (const [day, grade, term, summer] of [
    ["2026-08-31", 1, 1, false],
    ["2026-09-01", 1, 1, false],
    ["2027-01-31", 1, 1, false],
    ["2027-02-01", 1, 2, false],
    ["2027-06-30", 1, 2, false],
    ["2027-07-01", 2, 1, true],
    ["2027-08-31", 2, 1, true],
    ["2027-09-01", 2, 1, false],
    ["2028-07-01", 3, 1, true],
    ["2031-09-01", 6, 1, false],
  ]) {
    const context = learningContext(
      { progressionMode: "auto", entryYear: 2026 },
      day,
    );
    assert.deepEqual(
      [context.grade, context.term, context.summer],
      [grade, term, summer],
      day,
    );
  }
  assert.equal(
    learningContext(
      { progressionMode: "manual", grade: 3, term: 2 },
      "2027-07-01",
    ).label,
    "三年级下学期",
  );
  assert.equal(learningContext({ entryYear: 2025 }, "2026-11-01").grade, 2);
  for (const invalid of [
    { grade: 7 },
    { entryYear: 0 },
    { englishLevel: 9 },
    { progressionMode: "magic" },
  ])
    assert.throws(() => validateProgression(invalid));
});
test("each grade receives its own maths; English keeps the selected starting level", () => {
  validateCatalog(catalog);
  for (let grade = 1; grade <= 6; grade++) {
    const s = state(grade),
      route = plan("math", catalog, s, "2026-11-01");
    assert.equal(route.selected[0].grade || 1, grade);
    const session = makeSession("math", catalog, s, "2026-11-01");
    assert.equal(session.items.length, 6);
    assert.equal(new Set(session.items.map((i) => i.id)).size, 6);
    assert.equal(plan("english", catalog, s).selected[0].englishLevel, 1);
    s.profile.englishLevel = 3;
    assert.equal(plan("english", catalog, s).selected[0].englishLevel, 3);
  }
  const s = state(1);
  s.profile.progressionMode = "auto";
  assert.equal(plan("math", catalog, s, "2027-07-01").selected[0].grade, 2);
  for (const grade of [3, 4, 5, 6]) {
    const s = state(grade);
    for (const topic of ["guarantee", "square-count", "winning-strategy"])
      for (let level = 1; level <= 3; level++) {
        const run = makeSession(
          "thinking",
          catalog,
          s,
          "2026-11-01",
          `t-${topic}-${level}`,
        );
        assert.equal(run.items.length, 3, `${grade} ${topic} ${level}`);
      }
  }
});
test("new arithmetic and enrichment answers agree with independent model solvers over 14,500 cases", () => {
  const skills = catalog.skills.filter((s) =>
    /^(math-|think-)/.test(s.template),
  );
  for (const skill of skills)
    for (let i = 0; i < 500; i++) {
      const item = makeItem(skill, "independent-" + i, i),
        m = item.model;
      let expected;
      switch (m.type) {
        case "operation":
          expected =
            m.op === "+" ? m.a + m.b : m.op === "−" ? m.a - m.b : m.a * m.b;
          break;
        case "groups":
          expected = Array.from({ length: m.groups }, () => m.each).reduce(
            (a, b) => a + b,
            0,
          );
          break;
        case "share":
          expected = m.total / m.groups;
          break;
        case "remainder":
          expected = Math.ceil(m.total / m.each);
          break;
        case "measure":
          expected =
            m.mode === "area"
              ? m.length * m.width
              : m.mode === "triangle"
                ? (m.length * m.width) / 2
                : 2 * m.length + 2 * m.width;
          break;
        case "convert":
          expected = m.whole * m.factor + m.part;
          break;
        case "average":
          expected = m.numbers.reduce((a, b) => a + b) / m.numbers.length;
          break;
        case "decimal":
          expected = (m.cents.reduce((a, b) => a + b) / 100).toFixed(2);
          break;
        case "circle":
          expected = ((314 * m.radius * m.radius) / 100).toFixed(2);
          break;
        case "percent":
          expected = (m.total / 100) * m.percent;
          break;
        case "ratio":
          expected = (m.total / (m.a + m.b)) * m.a;
          break;
        case "fraction": {
          const [n, d] = item.answer.split("/").map(Number);
          const numerator = m.multiply ? m.a * m.b : m.a + m.b,
            denominator = m.multiply ? m.d * m.e : m.d;
          assert.equal(n * denominator, d * numerator);
          expected = item.answer;
          break;
        }
        case "pigeonhole": {
          let count = 0;
          const boxes = Array(m.colors).fill(0);
          while (Math.max(...boxes) < m.wanted) {
            boxes[count % boxes.length]++;
            count++;
          }
          expected = count;
          break;
        }
        case "squares": {
          expected = 0;
          for (let x = 0; x < m.columns; x++)
            for (let y = 0; y < m.rows; y++)
              for (
                let size = 1;
                size <= Math.min(m.columns - x, m.rows - y);
                size++
              )
                if (!(m.missingCorner && x === 0 && y === 0)) expected++;
          break;
        }
        case "strategy": {
          const win = [false];
          for (let n = 1; n <= m.pile; n++)
            win[n] = Array.from(
              { length: Math.min(m.max, n) },
              (_, j) => j + 1,
            ).some((take) => !win[n - take]);
          const moves = Array.from({ length: m.max }, (_, j) => j + 1).filter(
            (take) => take <= m.pile && !win[m.pile - take],
          );
          assert.ok(moves.length <= 1);
          expected = moves[0] || 0;
          break;
        }
        default:
          assert.fail(m.type);
      }
      assert.equal(item.answer, expected, skill.id);
      assert.equal(isCorrect(item, item.answer), true);
      if (item.choices) {
        assert.equal(new Set(item.choices).size, 3);
        assert.ok(item.choices.includes(item.answer));
      }
    }
});
