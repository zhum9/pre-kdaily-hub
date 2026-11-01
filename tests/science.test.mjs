import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import {
  validateScienceCatalog,
  validateScienceState,
  makeScienceSession,
  emptyScience,
  scienceSpeech,
  nextScienceLesson,
} from "../science/engine.js";
import { questionSpeech } from "../learning/audio.js";
const catalog = JSON.parse(
  await readFile(
    new URL("../content/science-2026.11.01.json", import.meta.url),
  ),
);
test("science publication has 12 sourced themes, 36 distinct lessons, 72 checks and a valid checksum", async () => {
  validateScienceCatalog(catalog);
  assert.equal(catalog.topics.length, 12);
  const lessons = catalog.topics.flatMap((t) => t.levels);
  assert.equal(lessons.length, 36);
  assert.equal(new Set(lessons.map((l) => l.title)).size, 36);
  assert.equal(lessons.flatMap((l) => l.checks).length, 72);
  assert.ok(
    lessons
      .filter((l) => l.level === 2)
      .every((l) => l.checks.some((q) => q.table) || l.id === "sky-2"),
  );
  const manifest = JSON.parse(
    await readFile(
      new URL("../content/science-manifest.json", import.meta.url),
    ),
  );
  const bytes = await readFile(
    new URL("../content/" + manifest.file, import.meta.url),
  );
  assert.equal(
    createHash("sha256").update(bytes).digest("hex"),
    manifest.sha256,
  );
});
test("question snapshots survive revisions; random answer positions do not change the correct choice", () => {
  for (const topic of catalog.topics)
    for (const lesson of topic.levels) {
      const positions = new Set();
      for (let i = 0; i < 40; i++) {
        const run = makeScienceSession(catalog, lesson.id, lesson.id + "-" + i);
        positions.add(
          run.lesson.checks[0].choices.indexOf(run.lesson.checks[0].correct),
        );
        const s = emptyScience();
        s.sessions[run.id] = run;
        validateScienceState(s);
        assert.deepEqual(
          run.lesson.checks.map((q) => q.correct),
          lesson.checks.map((q) => q.correct),
        );
        run.lesson.explanation = "changed snapshot";
        assert.notEqual(lesson.explanation, run.lesson.explanation);
      }
      assert.equal(positions.size, 3, lesson.id);
    }
});
test("narration includes sample status, all evidence rows and choices, without answer explanations", () => {
  const q = catalog.topics[0].levels[1].checks[0],
    speech = questionSpeech(scienceSpeech(q))[0].text;
  for (const row of q.table.rows)
    for (const cell of row) assert.ok(speech.includes(cell));
  assert.ok(speech.includes(q.table.label));
  assert.ok(!speech.includes(q.explanation));
});
test("bad science content and dishonest saved answers are rejected; plan moves after actual completion", () => {
  for (const mutate of [
    (c) => (c.sources[0].url = "javascript:alert(1)"),
    (c) => (c.topics[0].sources = ["unknown"]),
    (c) => (c.topics[0].levels[0].checks[0].correct = "absent"),
    (c) => (c.topics[0].levels[1].checks[0].table.label = "孩子实测"),
  ]) {
    const c = structuredClone(catalog);
    mutate(c);
    assert.throws(() => validateScienceCatalog(c));
  }
  const s = emptyScience(),
    run = makeScienceSession(catalog, "shadow-1", "session");
  s.sessions[run.id] = run;
  assert.equal(nextScienceLesson(catalog, s.sessions).id, "shadow-1");
  for (const q of run.lesson.checks)
    run.answers[q.id] = {
      value: q.correct,
      correct: true,
      at: new Date().toISOString(),
    };
  run.finishedAt = new Date().toISOString();
  validateScienceState(s);
  assert.equal(nextScienceLesson(catalog, s.sessions).id, "sound-1");
  run.answers[run.lesson.checks[0].id].correct = false;
  assert.throws(() => validateScienceState(s));
});
