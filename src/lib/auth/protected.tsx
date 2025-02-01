import { auth } from "~/lib/auth";
import { type Role, type User } from "@prisma/client";
import { redirect, unauthorized } from "next/navigation";
import { type Permission, hasPermission, hasRole } from "../permissions";
import type React from "react";

type PageProps = Record<string, unknown>;

export function withProtected<P extends PageProps>(
    Component: (props: P & { userId: string }) => Promise<React.ReactElement>,
    permissions: Permission[] = [],
    roles: Role[] = [],
) {
  return async function ProtectedComponent(
      props: P,
  ): Promise<React.ReactElement> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
      const session = await auth();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (!session?.user?.id) {
        redirect("/");
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
      if (roles.length && !hasRole(session.user.role, roles)) {
        unauthorized();
      }

      if (
          permissions.length &&
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-member-access
          !permissions.every((p) => hasPermission(session.user.role, p))
      ) {
        unauthorized();
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return Component({ ...props, userId: session.user.id as User["id"] });
    } catch {
      redirect("/");
    }
  };
}
