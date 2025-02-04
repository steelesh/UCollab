import { auth } from '~/lib/auth/auth';
import { ErrorMessage } from '~/lib/constants';
import { UpdateUserInput } from '~/schemas/user.schema';
import { UserService } from '~/services/user.service';
import { Role } from '@prisma/client';

export async function updateUser(userId: string, data: UpdateUserInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  return UserService.updateUser(userId, data, session.user.id);
}

export async function updateUserRole(userId: string, role: Role) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  return UserService.updateUserRole(userId, role, session.user.id);
}

export async function deleteUser(userId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  return UserService.deleteUser(userId, session.user.id);
}
