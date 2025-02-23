import { auth } from '../../../auth';
import { ErrorMessage } from '~/lib/utils';
import { UpdateProfileInput } from '~/features/profiles/profile.schema';
import { ProfileService } from '~/features/profiles/profile.service';

export async function updateProfile(data: UpdateProfileInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  return ProfileService.updateProfile(session.user.id, data, session.user.id);
}
