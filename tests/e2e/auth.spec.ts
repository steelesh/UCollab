import { expect, test } from "@playwright/test";

test("clicking sign in button redirects to UC auth via Microsoft Entra", async ({ page }) => {
  await page.goto("/");

  const signInButton = page.getByRole("button", { name: "Sign In" });

  await expect(signInButton).toBeVisible();

  await signInButton.click();

  await expect(async () => {
    const url = page.url();

    expect(url).toContain("login.microsoftonline.com");
  }).toPass({ timeout: 15000 });
});
