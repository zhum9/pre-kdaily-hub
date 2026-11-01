import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import {
  validateCatalog,
  makeItem,
  makeSession,
  isCorrect,
  mastery,
  availability,
  DEFAULT_PROFILE,
  localDay,
  plan,
} from "../learning/engine.js";
const catalog = JSON.parse(
  await readFile(
    new URL("../content/catalog-2026.11.01.json", import.meta.url),
  ),
);
const initial = () => ({
  profile: { ...DEFAULT_PROFILE },
  attempts: [],
  sessions: {},
  habits: {},
  interests: [],
});
test("published manifest matches the validated content exactly", async () => {
  validateCatalog(catalog);
  const manifest = JSON.parse(
    await readFile(new URL("../content/manifest.json", import.meta.url)),
  );
  const bytes = await readFile(
    new URL("../content/" + manifest.file, import.meta.url),
  );
  assert.equal(
    createHash("sha256").update(bytes).digest("hex"),
    manifest.sha256,
  );
  assert.equal(manifest.version, catalog.version);
});
test("rejects unknown generators, missing prerequisites and dependency cycles", () => {
  for (const mutation of [
    (c) => (c.skills[0].template = "eval"),
    (c) => (c.skills[0].prerequisites = ["absent"]),
    (c) => (c.skills[0].prerequisites = ["m-count10"]),
    (c) => (c.skills[0].sources = ["absent"]),
  ]) {
    const c = structuredClone(catalog);
    mutation(c);
    assert.throws(() => validateCatalog(c));
  }
});
test("generated problems have valid answers, bounded arithmetic and unique, solvable choices across 12,000 variants", () => {
  for (const skill of catalog.skills)
    for (let i = 0; i < 500; i++) {
      const item = makeItem(skill, "property-seed-" + i, i);
      assert.ok(item.prompt);
      assert.ok(item.hint);
      assert.ok(item.explanation);
      assert.equal(isCorrect(item, item.answer), true);
      if (item.kind === "number") {
        assert.ok(Number.isInteger(item.answer));
        assert.ok(item.answer >= 0);
        assert.equal(isCorrect(item, ""), false);
        assert.equal(isCorrect(item, "  "), false);
        assert.equal(isCorrect(item, "1e1"), false);
        assert.equal(isCorrect(item, "-1"), false);
      }
      if (item.choices) {
        const values = item.choices.map((c) =>
          typeof c === "object" ? c.en : c,
        );
        assert.equal(new Set(values).size, values.length);
        assert.ok(values.includes(item.answer));
      }
      const sum = item.prompt.match(/^(\d+) \+ (\d+) =/),
        difference = item.prompt.match(/^(\d+) − (\d+) =/);
      if (sum) {
        assert.equal(item.answer, Number(sum[1]) + Number(sum[2]));
        assert.ok(item.answer <= skill.max);
        if (skill.template === "carry") {
          assert.ok(Number(sum[1]) + Number(sum[2]) > 10);
          assert.ok(Number(sum[1]) < 10 && Number(sum[2]) < 10);
        }
      }
      if (difference) {
        assert.equal(
          item.answer,
          Number(difference[1]) - Number(difference[2]),
        );
        assert.ok(Number(difference[1]) <= skill.max);
        if (skill.template === "borrow")
          assert.ok(Number(difference[1]) % 10 < Number(difference[2]));
      }
      if (skill.template === "balance") {
        assert.ok(item.prompt.includes("数量未知"));
        assert.ok(!/左边 \d+ 个/.test(item.prompt));
      }
      if (skill.template === "english")
        assert.ok(
          skill.words.some(
            (w) => w.en === item.listen || w.cue === item.listen,
          ),
        );
    }
});
test("sessions are deterministic, contain no duplicated problems, preserve edition snapshots, and vary with practice history", () => {
  for (const subject of ["math", "english", "thinking"]) {
    const s = initial(),
      one = makeSession(subject, catalog, s, "2026-11-01");
    assert.deepEqual(one, makeSession(subject, catalog, s, "2026-11-01"));
    assert.ok(one.items.length > 0);
    assert.equal(new Set(one.items.map((i) => i.id)).size, one.items.length);
    assert.ok(one.items.every((i) => i.catalogVersion === catalog.version));
    s.sessions[one.id] = one;
    s.attempts = one.items.map((i) => ({ day: "2026-11-01", itemId: i.id }));
    const two = makeSession(subject, catalog, s, "2026-11-01");
    assert.ok(two.items.every((i) => !one.items.some((j) => i.id === j.id)));
  }
});
const evidence = (id, n = 8) =>
  Array.from({ length: n }, (_, i) => ({
    id: "a" + i,
    skillId: id,
    itemId: id + ":" + i,
    day: i < 4 ? "2026-10-30" : "2026-10-31",
    at: `2026-10-${i < 4 ? "30" : "31"}T10:00:0${i}Z`,
    correct: true,
    hintUsed: false,
    supported: false,
    explained: i === 2,
    transfer: i === 2,
    kind: "number",
  }));
test("mastery requires independent varied evidence across days, explanation and transfer", () => {
  const records = evidence("m-add10");
  assert.equal(mastery("m-add10", records, "2026-11-01").status, "secure");
  for (const transform of [
    (a) => ({ ...a, day: "2026-10-31" }),
    (a) => ({ ...a, hintUsed: true }),
    (a) => ({ ...a, supported: true }),
    (a) => ({ ...a, explained: false }),
    (a) => ({ ...a, transfer: false }),
    (a) => ({ ...a, itemId: "same" }),
  ])
    assert.notEqual(
      mastery("m-add10", records.map(transform), "2026-11-01").status,
      "secure",
    );
  assert.equal(mastery("m-add10", records, "2026-11-09").due, true);
});
test("check-in and rewards cannot unlock next-term content; prerequisite mastery and parent choice both matter", () => {
  const s = initial(),
    next = catalog.skills.find((s) => s.id === "m-borrow");
  s.checkInDates = Array(100).fill("2026-10-01");
  s.stars = 9999;
  assert.equal(availability(next, catalog, s).allowed, false);
  s.profile.preview = true;
  assert.equal(availability(next, catalog, s).allowed, false);
  s.attempts = [...evidence("m-carry"), ...evidence("m-sub10")];
  assert.equal(availability(next, catalog, s).allowed, true);
  s.profile.preview = false;
  assert.equal(availability(next, catalog, s).allowed, false);
});
test("failed recall updates evidence rather than preserving an earlier success forever", () => {
  const records = evidence("m-add10");
  for (let i = 0; i < 3; i++)
    records.push({
      ...records[i],
      id: "retry" + i,
      correct: false,
      day: "2026-11-01",
      at: `2026-11-01T10:00:0${i}Z`,
    });
  assert.notEqual(mastery("m-add10", records, "2026-11-01").status, "secure");
});
test("due practice takes priority and Shanghai date boundaries are stable", () => {
  const s = initial();
  s.attempts = evidence("m-compose").map((a) => ({ ...a, hintUsed: true }));
  const p = plan("math", catalog, s, "2026-11-03");
  assert.equal(p.selected[0].id, "m-compose");
  assert.equal(localDay(new Date("2026-10-31T16:01:00Z")), "2026-11-01");
});
test("each template supplies enough distinct transferable evidence for progress", () => {
  for (const s of catalog.skills) {
    const items = Array.from({ length: 500 }, (_, i) =>
      makeItem(s, "coverage-" + i, i),
    );
    assert.ok(
      new Set(items.map((i) => i.id)).size >= 6,
      s.id + " needs six distinct problems",
    );
    assert.ok(
      items.some((i) => i.transfer),
      s.id + " needs an application task",
    );
  }
});
test("retired navigation is absent from runtime and all precached resources exist", async () => {
  const [js, css, sw] = await Promise.all(
    ["app.js", "app.css", "sw.js"].map((f) =>
      readFile(new URL("../" + f, import.meta.url), "utf8"),
    ),
  );
  assert.ok(!/宣城|amap:\/\/|baidumap|places-page|id:`places`/.test(js + css));
  for (const match of sw.matchAll(/'\/(.*?)'/g)) {
    const file = match[1].split("?")[0] || "index.html";
    await readFile(new URL("../" + file, import.meta.url));
  }
});
