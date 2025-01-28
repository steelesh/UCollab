import { hasRole } from "@/src/lib/permissions";
import { UserService } from "@/src/services/user.service";
import { Role } from "@prisma/client";
import { AdminHomePage } from "./admin-homepage";
import { UserHomePage } from "./user-homepage";

type HomePageUser = Awaited<ReturnType<typeof UserService.getHomePageUser>>;

interface AuthenticatedHomeProps {
  user: NonNullable<HomePageUser>;
}

export function AuthenticatedHomePage({ user }: AuthenticatedHomeProps) {
  // check if user has admin role
  const hasAdminRole = hasRole(user.role, [Role.ADMIN]);

  // if user has admin role, show admin home page
  if (hasAdminRole) {
    return <AdminHomePage user={user} />;
  }

  // if user has user role, show user home page
  return <UserHomePage user={user} />;
}
