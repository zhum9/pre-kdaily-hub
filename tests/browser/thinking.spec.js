import { test, expect } from "@playwright/test";
const open = async (page, name) =>
  page.locator(".sidebar").getByRole("button", { name }).click();
test("all seven topics expose three directly selectable levels with worked methods and distinct practice", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByText("今天，走好自己的这一小步")).toBeVisible();
  await open(page, "思维探索");
  await expect(
    page.getByRole("heading", { name: "一年级轻奥探索" }),
  ).toBeVisible();
  await expect(page.locator(".edu-topic")).toHaveCount(7);
  await expect(page.locator(".edu-levels button")).toHaveCount(21);
  await page
    .getByRole("button", { name: "和差画图 挑战", exact: true })
    .click();
  await expect(page.getByText("第3层 · 挑战", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "和差画图 · 三份数量关系", exact: true }),
  ).toBeInViewport({ ratio: 1 });
  await expect(
    page.getByRole("heading", { name: "先看一道例题" }),
  ).toBeVisible();
  await expect(page.locator(".edu-bars")).toBeVisible();
  await page.getByText("先想一想，再看解题方法", { exact: true }).click();
  await expect(page.locator(".edu-worked-example li")).toHaveCount(3);
  const example = await page.locator(".edu-worked-example>p").textContent();
  await page.getByRole("button", { name: "开始这一小轮" }).click();
  await expect(page.locator(".edu-question h3")).not.toHaveText(example);
  await page.getByRole("button", { name: "暂停，回到路线" }).click();
  await expect(
    page.getByRole("heading", { name: "一年级轻奥探索" }),
  ).toBeVisible();
  await expect(page.locator(".edu-coach").first()).toContainText("和差画图");
  await open(page, "数学小课堂");
  await expect(
    page.getByRole("heading", { name: "数学思维基础" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "规律侦探", exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("grid challenge has a real blocked-intersection diagram and works on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByText("今天，走好自己的这一小步")).toBeVisible();
  await page
    .getByRole("button", { name: /菜单|导航/ })
    .first()
    .click();
  await open(page, "思维探索");
  await page.screenshot({
    path: ".review/mobile-enrichment-hub.png",
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "网格路线 挑战", exact: true })
    .click();
  await expect(
    page.getByRole("img", { name: /不能经过红叉交点/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: "开始这一小轮" }).click();
  await expect(
    page.getByRole("img", { name: /不能经过红叉交点/ }),
  ).toBeVisible();
  await page.screenshot({
    path: ".review/mobile-grid-challenge.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
});
test("content upgrade archives unfinished old foundation sessions without deleting their evidence or snapshots", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByText("今天，走好自己的这一小步")).toBeVisible();
  const original = await page.evaluate(async () => {
    const store = await import("/learning/store.js?v=31");
    const engine = await import("/learning/engine.js?v=31");
    const old = await (await fetch("/content/catalog-2026.11.01.json")).json();
    const item = engine.makeItem(
      old.skills.find((s) => s.id === "t-pattern"),
      "old-session",
      0,
    );
    const attempt = {
      id: "preserved-old-evidence",
      itemId: item.id,
      skillId: item.skillId,
      day: engine.localDay(),
      at: new Date().toISOString(),
      correct: true,
      item,
    };
    await store.update((s) => {
      s.catalog = old;
      s.sessions["old-foundation"] = {
        id: "old-foundation",
        subject: "thinking",
        day: engine.localDay(),
        items: [item],
        answers: {},
        finished: false,
        preferredId: null,
      };
      s.attempts.push(attempt);
    });
    return item;
  });
  await page.reload();
  await expect(page.getByText("今天，走好自己的这一小步")).toBeVisible();
  await open(page, "思维探索");
  await expect(page.locator(".edu-levels button")).toHaveCount(21);
  const state = await page.evaluate(async () => {
    const s = await import("/learning/store.js?v=31");
    return s.getSnapshot();
  });
  expect(state.catalog.version).toBe("2026.11.01.3");
  expect(state.sessions["old-foundation"].archived).toBe(true);
  expect(state.sessions["old-foundation"].items[0]).toEqual(original);
  expect(state.attempts.some((a) => a.id === "preserved-old-evidence")).toBe(
    true,
  );
  await page
    .getByRole("button", { name: "间隔与排队 进阶", exact: true })
    .click();
  await page.getByRole("button", { name: "开始这一小轮" }).click();
  await expect(page.locator(".edu-question h3")).not.toHaveText(
    original.prompt,
  );
});
