import { expect, test } from "@playwright/test";

test.describe("Environment-based Navigation", () => {
  test("should handle sign-in navigation based on environment", async ({
    page,
  }) => {
    // Test development mode
    await page.route("**/*", (route) => {
      if (route.request().url().includes("NODE_ENV")) {
        return route.fulfill({ json: "development" });
      }
      return route.continue();
    });
    await page.goto("/");
    await page.click('text="Sign in"');
    await expect(page).toHaveURL("/u");

    // Test production mode
    await page.route("**/*", (route) => {
      if (route.request().url().includes("NODE_ENV")) {
        return route.fulfill({ json: "production" });
      }
      return route.continue();
    });
    await page.goto("/");
    await page.click('text="Sign in"');
    await expect(page).toHaveURL("/signin");
  });

  test("should restrict /localdev access in production", async ({ page }) => {
    await page.route("**/*", (route) => {
      if (route.request().url().includes("NODE_ENV")) {
        return route.fulfill({ json: "production" });
      }
      return route.continue();
    });
    await page.goto("/localdev");
    await expect(page).toHaveURL("/");
  });
});
