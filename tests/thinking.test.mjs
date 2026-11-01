import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  makeItem,
  makeSession,
  DEFAULT_PROFILE,
  plan,
} from "../learning/engine.js";
const catalog = JSON.parse(
  await readFile(
    new URL("../content/catalog-2026.11.01-thinking.json", import.meta.url),
  ),
);
const skills = catalog.skills.filter((s) => s.subject === "thinking");
test("truth puzzles distribute the hidden ball across every listed person rather than leaking a fixed answer position", () => {
  const skill = skills.find((s) => s.id === "o-logic-matching-3"),
    positions = new Set();
  for (let i = 0; i < 200; i++) {
    const item = makeItem(skill, "positions-" + i, i);
    positions.add(item.model.people.indexOf(item.answer));
  }
  assert.deepEqual([...positions].sort(), [0, 1, 2]);
});
const perm = (values) =>
  values.length
    ? values.flatMap((v, i) =>
        perm(values.filter((_, j) => i !== j)).map((rest) => [v, ...rest]),
      )
    : [[]];
function solve(m) {
  switch (m.type) {
    case "interval": {
      if (m.ask === "length") return (m.trees - 1) * m.spacing;
      const positions = Array.from(
        { length: m.gaps + 1 },
        (_, i) => i * m.spacing,
      );
      return positions.filter((p, i) =>
        m.closed
          ? i < m.gaps
          : m.endpoints === 2
            ? true
            : m.endpoints === 1
              ? i < m.gaps
              : i > 0 && i < m.gaps,
      ).length;
    }
    case "interval-join":
      return new Set([
        ...Array.from({ length: m.first + 1 }, (_, i) => i),
        ...Array.from({ length: m.second + 1 }, (_, i) => m.first + i),
      ]).size;
    case "redistribute": {
      const moves = [];
      for (let n = 0; n <= m.a; n++)
        if (m.a - n - (m.b + n) === m.targetDifference) moves.push(n);
      assert.equal(moves.length, 1);
      return moves[0];
    }
    case "redistribute-reverse": {
      const possibilities = [];
      for (let d = 0; d <= 20; d++)
        if (d - m.move - m.move === m.remaining) possibilities.push(d);
      assert.equal(possibilities.length, 1);
      return possibilities[0];
    }
    case "equalize-three": {
      const [a, b, c] = m.piles,
        costs = [];
      for (let x = 0; x <= a; x++)
        for (let y = 0; y <= a - x; y++)
          if (a - x - y === b + x && b + x === c + y) costs.push(x + y);
      assert.ok(costs.length);
      return Math.min(...costs);
    }
    case "sumdiff":
    case "sumdiff-transfer":
    case "sumdiff-after-remove": {
      const answers = [];
      for (let a = 0; a <= 20; a++)
        for (let b = 0; b <= 20; b++) {
          const valid =
            m.type === "sumdiff"
              ? a + b === m.sum && a - b === m.difference
              : m.type === "sumdiff-transfer"
                ? a + b === m.sum && a - m.move === b + m.move
                : a - m.remove + b - m.remove === m.sumAfter &&
                  a - b === m.difference;
          if (valid) answers.push(m.ask === "smaller" ? b : a);
        }
      assert.equal(answers.length, 1);
      return answers[0];
    }
    case "sumdiff-three": {
      const answers = [];
      for (let a = 0; a <= 20; a++)
        for (let b = 0; b <= 20; b++)
          for (let c = 0; c <= 20; c++)
            if (a + b + c === m.sum && a - b === m.d1 && c - b === m.d2)
              answers.push([a, b, c][m.target]);
      assert.equal(answers.length, 1);
      return answers[0];
    }
    case "replace-chain":
      return Array(m.a)
        .fill(m.b)
        .reduce((a, b) => a + b, 0);
    case "replace-common":
    case "replace-whole": {
      const answers = [];
      for (let a = 1; a <= 20; a++)
        for (let p = 1; p <= 20; p++)
          if (
            m.type === "replace-common"
              ? a + p === m.first && a + p + p === m.second
              : a + a + p === m.first && a + p + p === m.second
          )
            answers.push(m.type === "replace-common" ? a : a + p);
      assert.equal(new Set(answers).size, 1);
      return answers[0];
    }
    case "coin-enumeration": {
      let ways = 0;
      for (let one = 0; one <= m.cap1; one++)
        for (let two = 0; two <= m.cap2; two++)
          if (one + two + two === m.target) ways++;
      return ways;
    }
    case "coin-count-enumeration": {
      let ways = 0;
      for (let one = 0; one <= m.count; one++)
        for (let two = 0; two <= m.count; two++)
          for (let five = 0; five <= m.count; five++)
            if (
              one + two + five === m.count &&
              one + two * 2 + five * 5 === m.target
            )
              ways++;
      return ways;
    }
    case "grid-routes": {
      let ways = 0;
      const steps = m.columns + m.rows;
      for (let mask = 0; mask < 2 ** steps; mask++) {
        let x = 0,
          y = 0,
          passed = !m.via,
          valid = true;
        for (let i = 0; i < steps; i++) {
          if (mask & (1 << i)) x++;
          else y++;
          if (
            x > m.columns ||
            y > m.rows ||
            (m.blocked && m.blocked.x === x && m.blocked.y === y)
          ) {
            valid = false;
            break;
          }
          if (m.via && m.via.x === x && m.via.y === y) passed = true;
        }
        if (valid && passed && x === m.columns && y === m.rows) ways++;
      }
      return ways;
    }
    case "matching": {
      const solutions = perm(m.items.map((_, i) => i)).filter((assign) =>
        m.clues.every((c) => (assign[c.person] === c.item) === c.equal),
      );
      assert.equal(solutions.length, 1);
      return m.items[solutions[0][m.target]];
    }
    case "truth-statements": {
      const owners = m.people
        .map((_, i) => i)
        .filter(
          (owner) =>
            m.statements
              .map((s) => (owner === s.owner) === s.equal)
              .filter(Boolean).length === m.trueCount,
        );
      assert.equal(owners.length, 1);
      return m.people[owners[0]];
    }
    default:
      throw Error("No independent solver for " + m.type);
  }
}
test("seven enrichment topics each have three levels, while old stable IDs are maths foundation", () => {
  assert.equal(skills.length, 21);
  assert.equal(new Set(skills.map((s) => s.topicId)).size, 7);
  for (const topic of new Set(skills.map((s) => s.topicId)))
    assert.deepEqual(
      skills.filter((s) => s.topicId === topic).map((s) => s.level),
      [1, 2, 3],
    );
  for (const id of [
    "t-pattern",
    "t-rank",
    "t-enumerate",
    "t-paths",
    "t-balance",
  ]) {
    const s = catalog.skills.find((s) => s.id === id);
    assert.equal(s.subject, "math");
    assert.equal(s.track, "foundation");
  }
});
test("6,300 enrichment variants have unique answers verified by exhaustive independent solvers", () => {
  for (const skill of skills)
    for (let i = 0; i < 300; i++) {
      const item = makeItem(skill, "independent-check-" + i, i);
      assert.equal(
        item.answer,
        solve(item.model),
        skill.id + " " + JSON.stringify(item.model),
      );
      assert.ok(item.steps.length >= 2);
      if (item.kind === "number")
        assert.ok(item.answer >= 0 && item.answer <= 20, skill.id);
    }
});
test("worked examples are correct and never reused as scored practice; each level has enough other variations", () => {
  for (const skill of skills) {
    const example = makeItem(skill, "worked-example:" + catalog.version, 0);
    assert.equal(example.answer, solve(example.model));
    const unique = new Set(
      Array.from(
        { length: 600 },
        (_, i) => makeItem(skill, "coverage-" + i, i).id,
      ),
    );
    unique.delete(example.id);
    assert.ok(unique.size >= 6, skill.id + " needs six non-example variants");
    const state = {
      profile: { ...DEFAULT_PROFILE },
      attempts: [],
      sessions: {},
    };
    const session = makeSession(
      "thinking",
      catalog,
      state,
      "2026-11-01",
      skill.id,
    );
    assert.equal(session.items.length, 3, skill.id);
    assert.ok(
      session.items.every((i) => i.id !== example.id && i.skillId === skill.id),
    );
  }
});
test("difficulty is structural: route levels add checkpoints then obstacles; matching grows to joint constraints and truth validation", () => {
  for (const [topic, expected] of [
    ["logic-matching", ["matching", "matching", "truth-statements"]],
    ["redistribute", ["redistribute", "redistribute", "equalize-three"]],
    ["replacement", ["replace-chain", "replace-common", "replace-whole"]],
  ]) {
    const items = skills
      .filter((s) => s.topicId === topic)
      .map((s) => makeItem(s, "structures", 0));
    assert.deepEqual(
      items.map((i) => i.model.type),
      expected,
    );
    if (topic === "logic-matching") {
      assert.equal(items[0].model.people.length, 3);
      assert.equal(items[1].model.people.length, 4);
    }
  }
  const routes = skills
    .filter((s) => s.topicId === "grid-routes")
    .map((s) => makeItem(s, "structures", 0));
  assert.equal(routes[0].diagram.via, null);
  assert.ok(routes[1].diagram.via);
  assert.ok(routes[2].diagram.blocked);
});
test("higher level selection steers recommendations without awarding mastery or hiding foundational maths in the daily core lesson", () => {
  const state = {
    profile: { ...DEFAULT_PROFILE, thinkingSkill: "o-sumdiff-3" },
    attempts: [],
    sessions: {},
  };
  assert.ok(
    plan("thinking", catalog, state).selected.some(
      (s) => s.id === "o-sumdiff-3",
    ),
  );
  assert.ok(
    plan("math", catalog, state).selected.every(
      (s) => s.track !== "foundation",
    ),
  );
});
