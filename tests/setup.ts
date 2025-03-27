import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("~/security/auth", () => ({
  signOut: vi.fn(),
}));
