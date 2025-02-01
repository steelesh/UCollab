import LocalDevPage from "@/src/app/(public pages)/localdev/page";
import { isDevelopment } from "@/src/lib/utils";
import { redirect } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/src/lib/utils", () => ({
  isDevelopment: vi.fn(),
}));

describe("LocalDevPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should redirect to home outside development mode", () => {
    vi.mocked(isDevelopment).mockReturnValue(false);

    LocalDevPage();
    expect(redirect).toHaveBeenCalledWith("/");
  });

  it("should render page in development mode", () => {
    vi.mocked(isDevelopment).mockReturnValue(true);

    const result = LocalDevPage();
    expect(result).toBeTruthy();
    expect(redirect).not.toHaveBeenCalled();
  });
});
