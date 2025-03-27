import { expect, test } from "@playwright/test";

test("homepage has correct title", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("UCollab - Home");
});
