import { expect, test } from "@playwright/test";

test("navigation through public pages works correctly", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("UCollab - Home");

  const footerLinks = [
    { path: "/accessibility", expectedTitle: "UCollab — Accessibility" },
    { path: "/privacy", expectedTitle: "UCollab — Privacy" },
    { path: "/license", expectedTitle: "UCollab — License" },
  ];

  for (const { path, expectedTitle } of footerLinks) {
    await page.goto(path);

    await expect(page).toHaveTitle(expectedTitle);
  }
});

test("protected routes redirect to home when unauthenticated users try to access them", async ({ page }) => {
  const protectedRoutes = ["/p", "/p/new", "/p/123"];

  for (const route of protectedRoutes) {
    await page.goto(route);

    await expect(page).toHaveURL("/");
  }
});
