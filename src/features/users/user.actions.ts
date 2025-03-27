"use server";

import type { User } from "@prisma/client";

import { Prisma } from "@prisma/client";
import { notFound, redirect } from "next/navigation";

import { onboardingSchema } from "~/features/users/user.schema";
import { UserService } from "~/features/users/user.service";
import { ErrorMessage, handleServerActionError, Utils } from "~/lib/utils";
import { auth } from "~/security/auth";

export async function updateOnboarding(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id)
    throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);
  const rawData = {
    gradYear: formData.get("gradYear"),
    technologies: JSON.parse(formData.get("technologies") as string),
    githubProfile: formData.get("githubProfile"),
    mentorshipStatus: formData.get("mentorshipStatus"),
  };
  const { gradYear, technologies, githubProfile, mentorshipStatus } = onboardingSchema.parse(rawData);
  try {
    await UserService.completeOnboarding(session.user.id, session.user.id, {
      gradYear,
      technologies,
      githubProfile,
      mentorshipStatus,
    });
  } catch (error) {
    if (error instanceof Utils)
      throw error;
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      notFound();
    }
    throw new Utils(ErrorMessage.OPERATION_FAILED);
  }
  redirect("/");
}

export async function updateUser(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id)
    throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);
  const userId = formData.get("userId")?.toString();
  if (!userId) {
    throw new Error("User ID is required");
  }
  const gradYearStr = formData.get("gradYear")?.toString();
  const gradYear = gradYearStr ? Number.parseInt(gradYearStr, 10) : undefined;
  const mentorshipValue = formData.get("mentorship")?.toString();
  const mentorship
    = mentorshipValue === "MENTOR" || mentorshipValue === "MENTEE" || mentorshipValue === "NONE"
      ? (mentorshipValue as "MENTOR" | "MENTEE" | "NONE")
      : undefined;
  const bio = formData.get("bio")?.toString() || undefined;
  const avatarValue = formData.get("avatar");
  const avatar = avatarValue instanceof File && avatarValue.size > 0 ? avatarValue : undefined;
  const allowComments = formData.get("allowComments") === "on";
  const allowMentions = formData.get("allowMentions") === "on";
  const allowProjectUpdates = formData.get("allowProjectUpdates") === "on";
  const allowSystem = formData.get("allowSystem") === "on";
  const updateUserInput = {
    gradYear,
    mentorship,
    bio,
    avatar,
    notificationPreferences: {
      allowComments,
      allowMentions,
      allowProjectUpdates,
      allowSystem,
    },
  };

  try {
    await UserService.updateUser(userId, updateUserInput, session.user.id);
  } catch (error) {
    if (error instanceof Utils)
      throw error;
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      notFound();
    }
    throw new Utils(ErrorMessage.OPERATION_FAILED);
  }
  redirect(`/u/${session.user.username}`);
}

export async function searchUsers(query: string, currentUserId: User["id"]) {
  return UserService.searchUsers(query, currentUserId);
}
export async function searchTechnologies(query: string) {
  const session = await auth();
  if (!session?.user?.id)
    throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  try {
    const technologies = await UserService.searchTechnologies(query, session.user.id);
    return technologies.map(t => t.name);
  } catch (error) {
    handleServerActionError(error);
  }
}
