"use server";

import { auth } from "@/auth";
import { CreateSkillInput, UpdateSkillInput } from "@/src/schemas/skill.schema";
import { SkillService } from "@/src/services/skill.service";
import { revalidatePath } from "next/cache";

export async function createSkill(data: CreateSkillInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const skill = await SkillService.createSkill(data, session.user.id);
  revalidatePath("/admin/skills");
  revalidatePath("/skills");
  return skill;
}

export async function suggestSkill(data: CreateSkillInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const skill = await SkillService.suggestSkill(data, session.user.id);
  revalidatePath("/skills");
  return skill;
}

export async function updateSkill(skillId: string, data: UpdateSkillInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const skill = await SkillService.updateSkill(skillId, data, session.user.id);
  revalidatePath("/admin/skills");
  revalidatePath("/skills");
  return skill;
}

export async function deleteSkill(skillId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  await SkillService.deleteSkill(skillId, session.user.id);
  revalidatePath("/admin/skills");
  revalidatePath("/skills");
}
