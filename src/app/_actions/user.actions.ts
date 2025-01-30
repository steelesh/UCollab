"use server";

import { auth } from "@/auth";
import { UpdateUserInput } from "@/src/schemas/user.schema";
import { UserService } from "@/src/services/user.service";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateUser(userId: string, data: UpdateUserInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const user = await UserService.updateUser(userId, data, session.user.id);
  revalidatePath(`/profile/${user.username}`);
  revalidatePath("/users");
  return user;
}

export async function updateUserRole(userId: string, role: Role) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const user = await UserService.updateUserRole(userId, role, session.user.id);
  revalidatePath(`/admin/users/${userId}`);
  revalidatePath("/admin/users");
  return user;
}

export async function deleteUser(userId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  await UserService.deleteUser(userId, session.user.id);
  revalidatePath("/admin/users");
  revalidatePath("/users");
}

export async function getHomePageUser() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  return UserService.getHomePageUser(session.user.id, session.user.id);
}
