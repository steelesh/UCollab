import { isDevelopment, isProduction, isTest } from "@/src/lib/utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.stubGlobal("process", {
    env: {
      NODE_ENV: "development",
    },
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Environment Utils", () => {
  describe("isDevelopment", () => {
    it("should return true when NODE_ENV is 'development'", () => {
      expect(isDevelopment()).toBe(true);
    });
  });

  describe("isProduction", () => {
    it("should return false when NODE_ENV is not 'production'", () => {
      expect(isProduction()).toBe(false);
    });
  });

  describe("isTest", () => {
    it("should return false when NODE_ENV is not 'test'", () => {
      expect(isTest()).toBe(false);
    });
  });
});
