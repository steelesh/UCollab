import { Role } from '@prisma/client';

export const hasRole = (userRole: Role | undefined, allowedRoles: Role[]) => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
};

export const canAccess = (userId: string | undefined, ownerId: string, userRole?: Role) => {
  if (!userId) return false;
  if (userRole === Role.ADMIN) return true;
  return userId === ownerId;
};
