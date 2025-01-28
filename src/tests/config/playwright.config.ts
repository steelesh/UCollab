import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./src/tests/e2e",
  outputDir: "./test-results/e2e",
  reporter: [
    ["list"],
    ["json", { outputFile: "test-results/e2e/results.json" }],
    ["html", { outputFolder: "test-results/e2e/report" }],
  ],
  use: {
    trace: "on-first-retry",
    video: "on-first-retry",
    baseURL: "http://localhost:3000",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: "smoke",
      testMatch: /.*\.smoke\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "e2e",
      testMatch: /.*\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
