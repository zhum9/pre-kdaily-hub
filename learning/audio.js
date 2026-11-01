// Narration describes the question and its controls, never its answer or hint.
const pictureNames = {
  "🔵": "蓝色圆形",
  "🟡": "黄色圆形",
  "🔺": "红色三角形",
  "🌸": "花朵",
  "🍀": "四叶草",
  "△": "三角形",
  "○": "圆形",
};
export function spokenText(text) {
  return String(text)
    .replace(
      /(\d+)\s*([+−-])\s*(\d+)\s*=\s*□/g,
      (_, a, op, b) => `${a}${op === "+" ? "加" : "减"}${b}等于多少？`,
    )
    .replace(/□/g, "几")
    .replace(/\+/g, "加")
    .replace(/−/g, "减")
    .replace(/=/g, "等于")
    .replace(/→/g, "，再到")
    .replace(/[🔵🟡🔺🌸🍀△○]/gu, (token) => pictureNames[token] || token)
    .replace(/\n/g, "；")
    .replace(/\s+/g, " ")
    .trim();
}
export function questionSpeech(item) {
  let text = spokenText(item.prompt);
  // Repeat-pattern tasks depend on colour/shape, and route tasks contain text
  // inside their diagram. Read those inputs as well, without counting for them.
  if (item.visual && /按同一组图案|图中的路线/.test(item.prompt))
    text += "。图中是：" + spokenText(item.visual) + "。";
  if (item.kind === "listening")
    return [
      {
        text: text + "听完后，点选你听到的图片，再点提交答案。",
        lang: "zh-CN",
      },
      { text: item.listen, lang: "en-US", purpose: "listening" },
    ];
  if (item.choices)
    text +=
      "。" +
      item.choices
        .map(
          (choice, i) =>
            `第${i + 1}个选项是${spokenText(typeof choice === "object" ? choice.zh : choice)}`,
        )
        .join("；") +
      "。选好后，点提交答案。";
  else text += "。在我的答案里填上数字，再点提交答案。";
  return [{ text, lang: "zh-CN" }];
}
export function speechErrorMessage(code) {
  if (code === "unsupported")
    return "这台设备暂不支持朗读，可以换用支持语音的浏览器。";
  if (code === "not-allowed" || code === "start-timeout")
    return "请点一下“重播读题”开启声音，之后会自动读下一题。";
  if (code === "english-unavailable")
    return "设备暂未提供英语声音，请检查语音设置；也可由家长示范，记为陪伴练习。";
  return "这次没有读完，点“重播读题”再听一次。";
}
export function createSpeechReader({
  synthesis = globalThis.speechSynthesis,
  Utterance = globalThis.SpeechSynthesisUtterance,
  voiceWaitMs = 1000,
  startWaitMs = 4000,
} = {}) {
  let generation = 0,
    release = () => {};
  function stop() {
    generation++;
    release();
    release = () => {};
    synthesis?.cancel();
  }
  function voicesReady(request) {
    const voices = synthesis.getVoices();
    if (voices.length) return Promise.resolve(voices);
    return new Promise((resolve) => {
      let timer;
      const done = () => {
        clearTimeout(timer);
        synthesis.removeEventListener?.("voiceschanged", changed);
        if (release === cancel) release = () => {};
        resolve(synthesis.getVoices());
      };
      const changed = () => {
        if (synthesis.getVoices().length) done();
      };
      const cancel = () => done();
      release = cancel;
      synthesis.addEventListener?.("voiceschanged", changed);
      timer = setTimeout(done, voiceWaitMs);
      if (request !== generation) done();
    });
  }
  function say(segment, voices, request, callbacks) {
    return new Promise((resolve) => {
      if (request !== generation) {
        resolve(false);
        return;
      }
      const voice = voices.find((v) =>
        v.lang.toLowerCase().startsWith(segment.lang === "en-US" ? "en" : "zh"),
      );
      if (segment.lang === "en-US" && !voice) {
        callbacks.onError?.("english-unavailable");
        callbacks.onStatus?.("error");
        resolve(false);
        return;
      }
      const utterance = new Utterance(segment.text);
      utterance.lang = segment.lang;
      utterance.rate = segment.lang === "en-US" ? 0.73 : 0.82;
      if (voice) utterance.voice = voice;
      let settled = false,
        timer;
      const done = (ok) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        utterance.onstart = utterance.onend = utterance.onerror = null;
        if (release === cancel) release = () => {};
        resolve(ok);
      };
      const cancel = () => done(false);
      release = cancel;
      const fail = (code) => {
        if (request === generation) {
          callbacks.onError?.(code);
          callbacks.onStatus?.("error");
        }
        done(false);
      };
      utterance.onstart = () => {
        clearTimeout(timer);
        if (request === generation) callbacks.onStatus?.("speaking");
      };
      utterance.onend = () => done(request === generation);
      utterance.onerror = (event) => fail(event.error || "failed");
      timer = setTimeout(() => {
        fail("start-timeout");
        if (request === generation) synthesis.cancel();
      }, startWaitMs);
      try {
        synthesis.speak(utterance);
      } catch {
        fail("failed");
      }
    });
  }
  async function read(segments, callbacks = {}) {
    stop();
    const request = generation;
    if (!synthesis || !Utterance) {
      callbacks.onError?.("unsupported");
      callbacks.onStatus?.("error");
      return false;
    }
    callbacks.onStatus?.("loading");
    try {
      const voices = await voicesReady(request);
      if (request !== generation) return false;
      for (const segment of segments.filter((s) => s.text)) {
        if (!(await say(segment, voices, request, callbacks))) return false;
        if (request !== generation) return false;
        callbacks.onSegmentEnd?.(segment);
      }
      if (request === generation) callbacks.onStatus?.("idle");
      return request === generation;
    } catch {
      if (request === generation) {
        callbacks.onError?.("failed");
        callbacks.onStatus?.("error");
      }
      return false;
    }
  }
  return { read, stop };
}
