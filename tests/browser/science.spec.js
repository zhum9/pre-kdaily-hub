import { test, expect } from "@playwright/test";
const open = (page, name) =>
  page.locator(".sidebar").getByRole("button", { name, exact: false }).click();
const latestRun = (page) =>
  page.evaluate(async () => {
    const s = await import("/learning/store.js?v=31");
    return Object.values(s.getSnapshot().science.sessions).at(-1);
  });
async function speech(page) {
  await page.addInitScript(() => {
    window.__scienceSpeech = [];
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      configurable: true,
      value: class {
        constructor(text) {
          this.text = text;
        }
      },
    });
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        getVoices: () => [{ lang: "zh-CN" }, { lang: "en-US" }],
        cancel() {},
        speak(u) {
          window.__scienceSpeech.push(u.text);
          setTimeout(() => {
            u.onstart?.();
            u.onend?.();
          }, 10);
        },
      },
    });
  });
}
test("science has 36 selectable lessons, speaks evidence, and preserves real observations through backup", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await speech(page);
  await page.goto("/");
  await open(page, "科普专区");
  await expect(
    page.getByRole("heading", { name: "小小科学研究所" }),
  ).toBeVisible();
  await expect(page.locator(".sci-topic")).toHaveCount(12);
  await expect(page.locator(".sci-levels button")).toHaveCount(36);
  await page
    .getByRole("button", { name: "纸桥工程局 证据推理", exact: true })
    .click();
  await expect
    .poll(() => page.evaluate(() => window.__scienceSpeech.length))
    .toBe(1);
  await page.getByRole("button", { name: "暂时不确定", exact: true }).click();
  await expect(page.locator(".sci-evidence figcaption")).toHaveText(
    "练习用示例记录，不是孩子实测",
  );
  await expect
    .poll(() =>
      page.evaluate(() =>
        window.__scienceSpeech.some(
          (t) => t.includes("7 块") && t.includes("不是孩子实测"),
        ),
      ),
    )
    .toBe(true);
  let run = await latestRun(page);
  const original = structuredClone(run.lesson);
  await page.reload();
  await open(page, "科普专区");
  await page.getByRole("button", { name: /继续探索：纸桥工程局/ }).click();
  expect((await latestRun(page)).lesson).toEqual(original);
  for (let i = 0; i < 2; i++) {
    run = await latestRun(page);
    const q = run.lesson.checks[i];
    await page.getByRole("radio", { name: q.correct, exact: true }).click();
    await page.getByRole("button", { name: "提交答案", exact: true }).click();
    if (i === 0) await page.getByRole("button", { name: "下一道挑战" }).click();
  }
  await page.getByLabel("结果和预测不同", { exact: true }).check();
  await page
    .getByLabel("我的观察或下次计划（选填）")
    .fill("第二次桥先歪了，积木没有放中央。");
  await page.getByRole("button", { name: "保存记录并完成本节思考" }).click();
  await expect(
    page.getByText("观察记录已保存，结果不同也值得研究。", { exact: true }),
  ).toBeVisible();
  const result = await page.evaluate(async () => {
    const s = await import("/learning/store.js?v=31");
    const backup = s.backup();
    await s.importBackup(backup);
    await s.importBackup(backup);
    return { science: s.getSnapshot().science, backup };
  });
  expect(Object.values(result.science.observations)).toHaveLength(1);
  expect(Object.values(result.science.observations)[0].note).toContain(
    "积木没有放中央",
  );
  const context = await page.context().browser().newContext();
  const fresh = await context.newPage();
  await fresh.goto("/");
  await expect(fresh.getByText("今天，走好自己的这一小步")).toBeVisible();
  const imported = await fresh.evaluate(async (backup) => {
    const s = await import("/learning/store.js?v=31");
    await s.initialize();
    await s.importBackup(backup);
    return s.getSnapshot().science;
  }, result.backup);
  expect(Object.values(imported.observations)).toHaveLength(1);
  expect(imported.sessions[run.id].lesson).toEqual(original);
  await context.close();
  await page.getByRole("button", { name: "返回探索主题" }).click();
  await expect(page.getByText("1 节有动手记录", { exact: true })).toBeVisible();
  await page.screenshot({
    path: ".review/science-hub-desktop.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
test("mobile science challenge works offline and a corrupted update preserves existing lessons", async ({
  page,
  context,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await speech(page);
  await page.goto("/");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page
    .getByRole("button", { name: /菜单|导航/ })
    .first()
    .click();
  await open(page, "科普专区");
  await expect(page.locator(".sci-topic")).toHaveCount(12);
  await page.evaluate(() => {
    window.__realFetch = window.fetch;
    window.fetch = (input, init) =>
      String(input).endsWith("/science-manifest.json")
        ? Promise.resolve(
            new Response(
              JSON.stringify({
                schemaVersion: 1,
                version: "broken",
                file: "science-2026.11.01.json",
                sha256: "0".repeat(64),
              }),
            ),
          )
        : window.__realFetch(input, init);
  });
  await page
    .getByRole("button", { name: "检查科普内容更新", exact: true })
    .click();
  await expect(page.getByText(/更新未成功.*校验未通过/)).toBeVisible();
  await page.evaluate(() => {
    window.fetch = window.__realFetch;
  });
  await context.setOffline(true);
  await page.reload();
  await page
    .getByRole("button", { name: /菜单|导航/ })
    .first()
    .click();
  await open(page, "科普专区");
  await page
    .getByRole("button", { name: "种子的秘密任务 设计探究", exact: true })
    .click();
  await page.getByRole("button", { name: "我猜会变化", exact: true }).click();
  await expect(page.locator(".sci-question")).toContainText("光照");
  await page.screenshot({
    path: ".review/science-mobile-challenge.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
});
test("parent grade controls actually change routes; old activities disappear and English keeps its starting level", async ({
  page,
}) => {
  await page.goto("/");
  await open(page, "家长设置");
  await page.getByLabel("年级安排方式", { exact: true }).selectOption("manual");
  await page.getByLabel("当前年级", { exact: true }).selectOption("2");
  await page.getByRole("button", { name: "保存学习设置" }).click();
  await expect(page.getByText(/设置已保存/)).toBeVisible();
  await open(page, "今日首页");
  await expect(
    page.getByText("二年级上学期 · 理解 / 习惯 / 好奇心", { exact: true }),
  ).toBeVisible();
  await open(page, "数学小课堂");
  await expect(
    page.getByRole("heading", { name: "百以内加减：算理与检查", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "开始这一小轮" }).click();
  const old = await page.evaluate(async () => {
    const s = await import("/learning/store.js?v=31");
    return Object.values(s.getSnapshot().sessions).at(-1);
  });
  expect(old.profileContext.grade).toBe(2);
  await open(page, "家长设置");
  await page.getByLabel("当前年级", { exact: true }).selectOption("6");
  await page.getByRole("button", { name: "保存学习设置" }).click();
  await open(page, "数学小课堂");
  await expect(
    page.getByRole("heading", {
      name: "分数乘法：一部分的几分之几",
      exact: true,
    }),
  ).toBeVisible();
  await open(page, "思维探索");
  await expect(
    page.getByRole("heading", { name: "六年级轻奥探索", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".edu-topic")).toHaveCount(3);
  await page
    .getByRole("button", { name: "分类数正方形 挑战", exact: true })
    .click();
  await expect(page.getByRole("img", { name: /左上角缺少一格/ })).toBeVisible();
  await open(page, "家长设置");
  await page.getByLabel("英语实际起点（独立于年级）").selectOption("2");
  await page.getByRole("button", { name: "保存学习设置" }).click();
  await open(page, "英语启蒙");
  await expect(
    page.getByRole("heading", {
      name: "礼貌表达：请求、接受与婉拒",
      exact: true,
    }),
  ).toBeVisible();
  for (const removed of [
    "专注力训练",
    "前庭专注力运动",
    "健康食谱",
    "益智小游戏",
  ])
    await expect(
      page.locator(".sidebar").getByText(removed, { exact: true }),
    ).toHaveCount(0);
  await open(page, "语文阅读");
  await expect(page.getByText(/比较两篇同主题材料的观点与证据/)).toBeVisible();
  await page.reload();
  await open(page, "今日首页");
  await expect(
    page.getByText("六年级上学期 · 理解 / 习惯 / 好奇心", { exact: true }),
  ).toBeVisible();
});
test("backups predating automatic grades retain an explicitly selected second term", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByText("今天，走好自己的这一小步")).toBeVisible();
  const profile = await page.evaluate(async () => {
    const s = await import("/learning/store.js?v=31");
    const old = s.backup();
    delete old.state.profile.progressionMode;
    delete old.state.profile.entryYear;
    delete old.state.profile.englishLevel;
    delete old.state.science;
    old.state.profile.term = 2;
    old.state.profile.configuredAt = "2026-10-01T00:00:00Z";
    await s.importBackup(old);
    return s.getSnapshot().profile;
  });
  expect(profile.progressionMode).toBe("manual");
  expect(profile.term).toBe(2);
  expect(profile.grade).toBe(1);
  await open(page, "家长设置");
  await expect(page.getByLabel("年级安排方式", { exact: true })).toHaveValue(
    "manual",
  );
});
