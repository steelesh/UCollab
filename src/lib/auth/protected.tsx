import { auth } from "@/auth";
import { Role, User } from "@prisma/client";
import { redirect, unauthorized } from "next/navigation";
import { Permission, hasPermission, hasRole } from "../permissions";

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
      const session = await auth();

      if (!session?.user?.id) {
        redirect("/");
      }

      if (roles.length && !hasRole(session.user.role, roles)) {
        unauthorized();
      }

      if (
        permissions.length &&
        !permissions.every((p) => hasPermission(session.user.role, p))
      ) {
        unauthorized();
      }

      return Component({ ...props, userId: session.user.id as User["id"] });
    } catch {
      redirect("/");
    }
  };
}
