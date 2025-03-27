import antfu from "@antfu/eslint-config";
// @ts-ignore
import nextPlugin from "@next/eslint-plugin-next";
import jestDom from "eslint-plugin-jest-dom";
import jsxA11y from "eslint-plugin-jsx-a11y";
import playwright from "eslint-plugin-playwright";
import testingLibrary from "eslint-plugin-testing-library";

export default antfu({
  type: "app",
  typescript: true,
  react: true,
  formatters: true,
  stylistic: {
    indent: 2,
    semi: true,
    quotes: "double",
  },
  ignores: ["docs/**/*"],
}, jsxA11y.flatConfigs.recommended, {
  plugins: {
    "@next/next": nextPlugin,
  },
  rules: {
    ...nextPlugin.configs.recommended.rules,
    ...nextPlugin.configs["core-web-vitals"].rules,
  },
}, {
  files: [
    "**/*.test.ts?(x)",
  ],
  ...testingLibrary.configs["flat/react"],
  ...jestDom.configs["flat/recommended"],
}, {
  files: [
    "**/*.spec.ts",
    "**/*.e2e.ts",
  ],
  ...playwright.configs["flat/recommended"],
}, {
  rules: {
    "ts/no-redeclare": "off",
    "ts/consistent-type-definitions": ["error", "type"],
    "no-console": ["warn"],
    "antfu/no-top-level-await": "off",
    "node/prefer-global/process": "off",
    "node/no-process-env": ["error"],
    "perfectionist/sort-imports": [
      "error",
      {
        tsconfigRootDir: ".",
      },
    ],
    "unicorn/filename-case": [
      "error",
      {
        case: "kebabCase",
        ignore: ["README.md"],
      },
    ],
    "react-refresh/only-export-components": "off",
    "style/brace-style": ["error", "1tbs"],
    "react/prefer-destructuring-assignment": "off",
    "test/padding-around-all": "error",
    "test/prefer-lowercase-title": "off",
  },
});
