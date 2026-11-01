import { test, expect } from "@playwright/test";
const openPage = async (page, title) =>
  page
    .locator(".sidebar")
    .getByRole("button", { name: title, exact: false })
    .click();
test("legacy rewards persist; maths evidence, hints and sessions survive reload", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() => {
    if (!localStorage.getItem("daily-hub-profile"))
      localStorage.setItem(
        "daily-hub-profile",
        JSON.stringify({
          stars: 42,
          food: 7,
          checkInDates: [],
          activePet: "silver",
        }),
      );
  });
  await page.goto("/");
  await expect(page.getByText("今天，走好自己的这一小步")).toBeVisible();
  await expect(page.getByText("到哪儿玩", { exact: true })).toHaveCount(0);
  await openPage(page, "数学小课堂");
  await page.getByRole("button", { name: "开始这一小轮" }).click();
  await expect(page.getByText(/第 1 \/ \d+ 题/)).toBeVisible();
  await page.getByRole("button", { name: "给我一点提示" }).click();
  await page.getByLabel("我的答案", { exact: true }).fill("");
  await expect(page.getByRole("button", { name: "提交答案" })).toBeDisabled();
  await page.getByLabel("我的答案", { exact: true }).fill("999");
  await page.getByRole("button", { name: "提交答案" }).click();
  await expect(page.getByText("我们一起看看思路")).toBeVisible();
  await page.reload();
  await openPage(page, "数学小课堂");
  await expect(page.getByText("我们一起看看思路")).toBeVisible();
  const data = await page.evaluate(async () => {
    const m = await import("/learning/store.js");
    await m.initialize();
    return {
      attempts: m.getSnapshot().attempts,
      legacy: JSON.parse(localStorage.getItem("daily-hub-profile")),
    };
  });
  expect(data.attempts).toHaveLength(1);
  expect(data.attempts[0].hintUsed).toBe(true);
  expect(data.legacy.stars).toBe(42);
  expect(errors).toEqual([]);
});
test("English teaches listening and parent activities; roadmap gates previews; settings and backup work", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByText("今天，走好自己的这一小步")).toBeVisible();
  await openPage(page, "英语启蒙");
  await expect(page.getByText("一起说一小段")).toBeVisible();
  await expect(page.getByText("离开屏幕，试一次")).toBeVisible();
  await page.getByRole("button", { name: "开始这一小轮" }).click();
  await expect(
    page.getByRole("button", { name: "播放英语声音" }),
  ).toBeVisible();
  await expect(page.locator(".edu-choices button")).toHaveCount(3);
  await expect(
    page.locator(".edu-choices").getByText("cat", { exact: true }),
  ).toHaveCount(0);
  await openPage(page, "成长路线");
  await expect(page.getByText("下学期预习由家长开启").first()).toBeVisible();
  await openPage(page, "家长设置");
  await page.getByLabel("教材版次备注").fill("2025年版，家长待核对");
  await page.getByRole("button", { name: "保存学习设置" }).click();
  await expect(page.locator(".edu-notice")).toContainText("设置已保存");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "导出完整备份" }).click();
  expect((await download).suggestedFilename()).toMatch(
    /^mario-learning-.*\.json$/,
  );
  await page.reload();
  await openPage(page, "家长设置");
  await expect(page.getByLabel("教材版次备注")).toHaveValue(
    "2025年版，家长待核对",
  );
});
test("mobile navigation, complete practice and PWA offline learning", async ({
  page,
  context,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByText("今天，走好自己的这一小步")).toBeVisible();
  await page.screenshot({ path: ".review/mobile-home.png", fullPage: true });
  // Use the genuine responsive navigation toggle, then its normal route button.
  const toggle = page.getByRole("button", { name: /菜单|导航/ }).first();
  if (await toggle.isVisible()) await toggle.click();
  await openPage(page, "思维探索");
  await page.getByRole("button", { name: "开始这一小轮" }).click();
  for (let i = 0; i < 3; i++) {
    await page.locator(".edu-choices button").first().click();
    await page.getByRole("button", { name: "提交答案" }).click();
    await page.getByRole("button", { name: /下一题|看看这次的收获/ }).click();
  }
  await page.getByRole("button", { name: "完成本次学习，保存打卡" }).click();
  await expect(page.getByText("这次学习已保存。休息一下")).toBeVisible();
  await page.screenshot({
    path: ".review/mobile-thinking.png",
    fullPage: true,
  });
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText("今天，走好自己的这一小步")).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
});
test("backups restore settings to a fresh device, merge without duplicate evidence, and preserve configured local settings", async ({
  page,
  browser,
}) => {
  await page.goto("/");
  await expect(page.getByText("今天，走好自己的这一小步")).toBeVisible();
  const backup = await page.evaluate(async () => {
    const s = await import("/learning/store.js");
    await s.update((state) => {
      state.profile.edition = "家庭核对版";
      state.profile.configuredAt = "2026-11-01T00:00:00Z";
      state.habits["2026-11-01"] = { prepare: true };
    });
    return s.backup();
  });
  const other = await browser.newContext(),
    second = await other.newPage();
  await second.goto("/");
  await expect(second.getByText("今天，走好自己的这一小步")).toBeVisible();
  const merged = await second.evaluate(async (data) => {
    const s = await import("/learning/store.js");
    await s.importBackup(data);
    await s.importBackup(data);
    return s.getSnapshot();
  }, backup);
  expect(merged.profile.edition).toBe("家庭核对版");
  expect(merged.habits["2026-11-01"].prepare).toBe(true);
  const preserved = await second.evaluate(async (data) => {
    const s = await import("/learning/store.js");
    await s.update((state) => {
      state.profile.edition = "本机已核对";
      state.profile.configuredAt = "2026-11-01T01:00:00Z";
    });
    await s.importBackup(data);
    return s.getSnapshot().profile.edition;
  }, backup);
  expect(preserved).toBe("本机已核对");
  await other.close();
});
test("tampered curriculum is rejected and last known content stays usable", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByText("今天，走好自己的这一小步")).toBeVisible();
  const result = await page.evaluate(async () => {
    const s = await import("/learning/store.js");
    const before = s.getSnapshot().catalog.version;
    const outcome = await s.refreshCatalog(async (url) =>
      url.includes("manifest")
        ? new Response(
            JSON.stringify({
              schemaVersion: 1,
              version: "tampered",
              file: "catalog-tampered.json",
              sha256: "0".repeat(64),
            }),
          )
        : new Response("{}"),
    );
    return {
      before,
      after: s.getSnapshot().catalog.version,
      offline: outcome.offline,
      error: outcome.error,
    };
  });
  expect(result.after).toBe(result.before);
  expect(result.offline).toBe(true);
  expect(result.error).toContain("校验未通过");
});
