import { auth } from 'auth';
import { ErrorMessage } from '~/lib/constants';
import { CreateTechnologyInput, SuggestTechnologyInput } from '~/schemas/technology.schema';
import { TechnologyService } from '~/services/technology.service';

export async function createTechnology(data: CreateTechnologyInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  return TechnologyService.createTechnology(data, session.user.id);
}

export async function suggestTechnology(data: SuggestTechnologyInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  return TechnologyService.suggestTechnology(data, session.user.id);
}

export async function verifyTechnology(technologyId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  return TechnologyService.verifyTechnology(technologyId, session.user.id);
}

export async function updatePostTechnologies(postId: string, technologies: string[]) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  return TechnologyService.updatePostTechnologies(postId, technologies);
}
