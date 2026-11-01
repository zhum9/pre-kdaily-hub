import test from "node:test";
import assert from "node:assert/strict";
import {
  questionSpeech,
  spokenText,
  createSpeechReader,
  speechErrorMessage,
} from "../learning/audio.js";
class Utterance {
  constructor(text) {
    this.text = text;
  }
}
const voices = [{ lang: "zh-CN" }, { lang: "en-US" }];
const tick = () => new Promise((resolve) => setImmediate(resolve));
test("equations, missing numbers and repeated-picture inputs become spoken questions without solutions", () => {
  const item = {
    prompt: "7 + 3 = □",
    kind: "number",
    answer: 10,
    hint: "secret hint",
    explanation: "secret solution",
  };
  const text = questionSpeech(item)
    .map((s) => s.text)
    .join("");
  assert.ok(text.includes("7加3等于多少"));
  assert.ok(!text.includes("10"));
  assert.ok(!text.includes("secret"));
  assert.ok(!text.includes("□"));
  assert.equal(
    spokenText("3/5 × 2/7，25%，6∶4，12 ÷ 3"),
    "5分之3 乘 7分之2，百分之25，6比4，12 除以 3",
  );
  assert.equal(
    spokenText("□ + 4 = 9，盒子里藏着几？"),
    "几 加 4 等于 9，盒子里藏着几？",
  );
  const pattern = questionSpeech({
    prompt: "按同一组图案不断重复，下一个是什么？",
    kind: "choice",
    visual: "🔵 🟡 🔵 🟡",
    choices: ["🔵", "🟡"],
  })[0].text;
  assert.ok(pattern.includes("蓝色圆形"));
  assert.ok(pattern.includes("第1个选项"));
  assert.ok(!pattern.includes("🔵"));
});
test("English questions give Chinese instructions then the original English audio, without announcing translations", () => {
  const segments = questionSpeech({
    prompt: "先听一听，再选择你听到的图片。",
    kind: "listening",
    listen: "Point to the cat.",
    answer: "cat",
    choices: [
      { en: "cat", zh: "猫" },
      { en: "dog", zh: "狗" },
    ],
  });
  assert.deepEqual(
    segments.map((s) => s.lang),
    ["zh-CN", "en-US"],
  );
  assert.equal(segments[1].purpose, "listening");
  assert.equal(segments[1].text, "Point to the cat.");
  assert.ok(!segments[0].text.includes("猫"));
});
test("reader serializes languages and only marks a segment heard after it ends", async () => {
  const pending = [],
    ended = [];
  const reader = createSpeechReader({
    synthesis: {
      cancel() {},
      getVoices: () => voices,
      speak: (u) => pending.push(u),
    },
    Utterance,
  });
  const reading = reader.read(
    [
      { text: "先听声音", lang: "zh-CN" },
      { text: "cat", lang: "en-US", purpose: "listening" },
    ],
    { onSegmentEnd: (s) => ended.push(s.lang) },
  );
  await tick();
  assert.equal(pending.length, 1);
  assert.deepEqual(ended, []);
  pending[0].onstart();
  pending[0].onend();
  await tick();
  assert.equal(pending.length, 2);
  assert.deepEqual(ended, ["zh-CN"]);
  pending[1].onstart();
  pending[1].onend();
  assert.equal(await reading, true);
  assert.deepEqual(ended, ["zh-CN", "en-US"]);
});
test("stopping or replacing a question cannot complete stale callbacks or continue its queued English", async () => {
  const pending = [],
    ended = [];
  const reader = createSpeechReader({
    synthesis: {
      cancel() {},
      getVoices: () => voices,
      speak: (u) => pending.push(u),
    },
    Utterance,
  });
  const old = reader.read(
    [
      { text: "旧题", lang: "zh-CN" },
      { text: "old", lang: "en-US" },
    ],
    { onSegmentEnd: (s) => ended.push(s.text) },
  );
  await tick();
  const staleEnd = pending[0].onend;
  const current = reader.read([{ text: "新题", lang: "zh-CN" }], {
    onSegmentEnd: (s) => ended.push(s.text),
  });
  await tick();
  staleEnd();
  assert.equal(await old, false);
  assert.equal(pending.length, 2);
  pending[1].onend();
  assert.equal(await current, true);
  assert.deepEqual(ended, ["新题"]);
});
test("late-loaded device voices are awaited and autoplay errors produce a retry message", async () => {
  let available = [],
    changed;
  const pending = [];
  const reader = createSpeechReader({
    synthesis: {
      cancel() {},
      getVoices: () => available,
      addEventListener: (type, fn) => {
        changed = fn;
      },
      removeEventListener() {},
      speak: (u) => pending.push(u),
    },
    Utterance,
    voiceWaitMs: 100,
  });
  const errors = [],
    reading = reader.read([{ text: "题目", lang: "zh-CN" }], {
      onError: (code) => errors.push(code),
    });
  await tick();
  assert.equal(pending.length, 0);
  available = voices;
  changed();
  await tick();
  assert.equal(pending.length, 1);
  pending[0].onerror({ error: "not-allowed" });
  assert.equal(await reading, false);
  assert.deepEqual(errors, ["not-allowed"]);
  assert.ok(speechErrorMessage(errors[0]).includes("重播读题"));
});
test("unavailable speech and a stalled start fail visibly instead of reporting success", async () => {
  const errors = [];
  let reader = createSpeechReader({ synthesis: null, Utterance });
  assert.equal(
    await reader.read([{ text: "题目", lang: "zh-CN" }], {
      onError: (code) => errors.push(code),
    }),
    false,
  );
  assert.equal(errors[0], "unsupported");
  reader = createSpeechReader({
    synthesis: { cancel() {}, getVoices: () => voices, speak() {} },
    Utterance,
    startWaitMs: 5,
  });
  assert.equal(
    await reader.read([{ text: "题目", lang: "zh-CN" }], {
      onError: (code) => errors.push(code),
    }),
    false,
  );
  assert.equal(errors.at(-1), "start-timeout");
});
