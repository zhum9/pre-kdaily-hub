import { test, expect } from "@playwright/test";
async function fakeSpeech(page, { blocked = false } = {}) {
  await page.addInitScript(
    ({ blocked }) => {
      window.__speechCalls = [];
      window.__speechEnds = [];
      class Utterance {
        constructor(text) {
          this.text = text;
        }
      }
      Object.defineProperty(window, "SpeechSynthesisUtterance", {
        value: Utterance,
        configurable: true,
      });
      Object.defineProperty(window, "speechSynthesis", {
        configurable: true,
        value: {
          getVoices: () => [{ lang: "zh-CN" }, { lang: "en-US" }],
          cancel() {},
          addEventListener() {},
          removeEventListener() {},
          speak(u) {
            window.__speechCalls.push({ text: u.text, lang: u.lang });
            setTimeout(() => {
              if (blocked) {
                u.onerror?.({ error: "not-allowed" });
                return;
              }
              u.onstart?.();
              setTimeout(() => {
                if (u.onend) {
                  window.__speechEnds.push(u.lang);
                  u.onend();
                }
              }, 80);
            }, 10);
          },
        },
      });
    },
    { blocked },
  );
}
const open = async (page, name) =>
  page.locator(".sidebar").getByRole("button", { name }).click();
test("every new question reads once, repeat is available, hints and feedback speak, and preference survives reload", async ({
  page,
}) => {
  await fakeSpeech(page);
  await page.goto("/");
  await expect(page.getByText("今天，走好自己的这一小步")).toBeVisible();
  await open(page, "数学小课堂");
  await page.getByRole("button", { name: "开始这一小轮" }).click();
  await expect
    .poll(() => page.evaluate(() => window.__speechCalls.length))
    .toBe(1);
  let calls = await page.evaluate(() => window.__speechCalls);
  expect(calls[0].text).toContain("我的答案");
  expect(calls[0].text).not.toContain("□");
  await page.getByLabel("我的答案", { exact: true }).fill("999");
  expect(await page.evaluate(() => window.__speechCalls.length)).toBe(1);
  await page.getByRole("button", { name: "重播读题" }).click();
  await expect
    .poll(() => page.evaluate(() => window.__speechCalls.length))
    .toBe(2);
  await page.getByRole("button", { name: "给我一点提示" }).click();
  await expect
    .poll(() => page.evaluate(() => window.__speechCalls.at(-1)?.text))
    .toContain("一点提示");
  await page.getByRole("button", { name: "提交答案" }).click();
  await expect
    .poll(() => page.evaluate(() => window.__speechCalls.at(-1)?.text))
    .toContain("我们一起看看思路");
  await page.getByRole("button", { name: "下一题" }).click();
  await expect(page.getByText(/第 2 \/ \d+ 题/)).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => window.__speechCalls.at(-1)?.text))
    .toContain("我的答案");
  await page.getByLabel("每题自动读", { exact: true }).uncheck();
  await expect(page.getByLabel("每题自动读", { exact: true })).toBeEnabled();
  await page.reload();
  await open(page, "数学小课堂");
  await expect(
    page.getByLabel("每题自动读", { exact: true }),
  ).not.toBeChecked();
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => window.__speechCalls.length)).toBe(0);
  await page.getByLabel("每题自动读", { exact: true }).check();
  await expect
    .poll(() => page.evaluate(() => window.__speechCalls.length))
    .toBe(1);
});
test("English automatic narration completes Chinese before English and question replay is not a hint", async ({
  page,
}) => {
  await fakeSpeech(page);
  await page.goto("/");
  await expect(page.getByText("今天，走好自己的这一小步")).toBeVisible();
  await open(page, "英语启蒙");
  await page.getByRole("button", { name: "开始这一小轮" }).click();
  await expect
    .poll(() => page.evaluate(() => window.__speechCalls.length))
    .toBe(2);
  const calls = await page.evaluate(() => window.__speechCalls);
  expect(calls.map((c) => c.lang)).toEqual(["zh-CN", "en-US"]);
  await expect
    .poll(() => page.evaluate(() => window.__speechEnds))
    .toEqual(["zh-CN", "en-US"]);
  await page.locator(".edu-choices button").first().click();
  await page.getByRole("button", { name: "提交答案" }).click();
  await expect(page.locator(".edu-feedback")).toBeVisible();
  const attempt = await page.evaluate(async () => {
    const s = await import("/learning/store.js?v=31");
    return s.getSnapshot().attempts[0];
  });
  expect(attempt.hintUsed).toBe(false);
  expect(attempt.supported).toBe(false);
});
test("browser autoplay blocking shows an actionable replay prompt without breaking answers", async ({
  page,
}) => {
  await fakeSpeech(page, { blocked: true });
  await page.goto("/");
  await expect(page.getByText("今天，走好自己的这一小步")).toBeVisible();
  await open(page, "数学小课堂");
  await page.getByRole("button", { name: "开始这一小轮" }).click();
  await expect(page.locator(".edu-audio-bar")).toContainText(
    "点一下“重播读题”",
  );
  await expect(page.getByLabel("我的答案", { exact: true })).toBeEnabled();
});
