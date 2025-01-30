"use server";

import { auth } from "@/auth";
import { UpdateProfileInput } from "@/src/schemas/profile.schema";
import { ProfileService } from "@/src/services/profile.service";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: UpdateProfileInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const profile = await ProfileService.updateProfile(
    session.user.id,
    data,
    session.user.id,
  );

  revalidatePath(`/profile/${session.user.username}`);
  revalidatePath("/profiles");
  return profile;
}
