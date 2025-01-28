import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    include: ["src/tests/integration/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      reportsDirectory: "./test-results/integration/coverage",
    },
    reporters: [
      "default",
      ["json", { outputFile: "test-results/integration/results.json" }],
      ["html", { outputFile: "test-results/integration/index.html" }],
    ],
  },
});
