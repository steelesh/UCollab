"use server";

import { auth } from "@/auth";
import {
  CreateTechnologyInput,
  SuggestTechnologyInput,
} from "@/src/schemas/technology.schema";
import { TechnologyService } from "@/src/services/technology.service";
import { revalidatePath } from "next/cache";

export async function createTechnology(data: CreateTechnologyInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const technology = await TechnologyService.createTechnology(
    data,
    session.user.id,
  );
  revalidatePath("/admin/technologies");
  revalidatePath("/technologies");
  return technology;
}

export async function suggestTechnology(data: SuggestTechnologyInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const technology = await TechnologyService.suggestTechnology(
    data,
    session.user.id,
  );
  revalidatePath("/technologies");
  return technology;
}

export async function verifyTechnology(technologyId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const technology = await TechnologyService.verifyTechnology(
    technologyId,
    session.user.id,
  );
  revalidatePath("/admin/technologies");
  revalidatePath("/technologies");
  return technology;
}

export async function updatePostTechnologies(
  postId: string,
  technologies: string[],
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const result = await TechnologyService.updatePostTechnologies(
    postId,
    technologies,
  );
  revalidatePath(`/posts/${postId}`);
  return result;
}
