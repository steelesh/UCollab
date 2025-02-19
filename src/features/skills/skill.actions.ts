import { auth } from '../../../auth';
import { ErrorMessage } from '~/lib/constants';
import { CreateSkillInput, UpdateSkillInput } from '~/features/skills/skill.schema';
import { SkillService } from '~/features/skills/skill.service';

export async function createSkill(data: CreateSkillInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  return SkillService.createSkill(data, session.user.id);
}

export async function suggestSkill(data: CreateSkillInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  return SkillService.suggestSkill(data, session.user.id);
}

export async function updateSkill(skillId: string, data: UpdateSkillInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  return SkillService.updateSkill(skillId, data, session.user.id);
}

export async function deleteSkill(skillId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  return SkillService.deleteSkill(skillId, session.user.id);
}
