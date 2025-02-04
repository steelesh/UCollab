import { canAccess, hasRole } from "@/src/lib/permissions";
import { Role } from "@prisma/client";
import { describe, expect, it } from "vitest";

describe("Permission Utils", () => {
  describe("hasRole", () => {
    it("should validate admin role", () => {
      expect(hasRole(Role.ADMIN, [Role.ADMIN])).toBe(true);
      expect(hasRole(Role.USER, [Role.ADMIN])).toBe(false);
    });

    it("should handle multiple allowed roles", () => {
      expect(hasRole(Role.ADMIN, [Role.ADMIN, Role.USER])).toBe(true);
      expect(hasRole(Role.USER, [Role.ADMIN, Role.USER])).toBe(true);
    });
  });

  describe("canAccess", () => {
    it("should allow admin access regardless of ownership", () => {
      expect(canAccess("user1", "user2", Role.ADMIN)).toBe(true);
    });

    it("should restrict non-admin access to owned resources", () => {
      expect(canAccess("user1", "user1", Role.USER)).toBe(true);
      expect(canAccess("user1", "user2", Role.USER)).toBe(false);
    });
  });
});
