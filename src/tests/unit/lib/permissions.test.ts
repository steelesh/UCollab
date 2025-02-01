import { isEnvironmentRoute } from "@/src/lib/permissions";
import { isDevelopment } from "@/src/lib/utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/src/lib/utils", () => ({
  isDevelopment: vi.fn(),
}));

describe("Environment Routes", () => {
  it("should block routes outside development mode", () => {
    vi.mocked(isDevelopment).mockReturnValue(false);
    expect(isEnvironmentRoute("/localdev")).toBe(false);
  });

  it("should allow development routes in development mode", () => {
    vi.mocked(isDevelopment).mockReturnValue(true);
    expect(isEnvironmentRoute("/localdev")).toBe(true);
  });

  it("should block non-development routes even in development mode", () => {
    vi.mocked(isDevelopment).mockReturnValue(true);
    expect(isEnvironmentRoute("/some-other-path")).toBe(false);
  });
});
