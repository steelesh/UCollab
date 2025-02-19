import { auth } from '../../../auth';
import { ErrorMessage } from '~/lib/constants';
import { CreateTechnologyInput } from '~/features/technologies/technology.schema';
import { TechnologyService } from '~/features/technologies/technology.service';

export async function createTechnology(data: CreateTechnologyInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  return TechnologyService.createTechnology(data, session.user.id);
}

export async function verifyTechnology(technologyId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  return TechnologyService.verifyTechnology(technologyId, session.user.id);
}

export async function updatePostTechnologies(postId: string, technologies: string[]) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  return TechnologyService.updatePostTechnologies(postId, technologies, session.user.id);
}
