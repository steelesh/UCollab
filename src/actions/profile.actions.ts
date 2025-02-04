import { auth } from 'auth';
import { ErrorMessage } from '~/lib/constants';
import { UpdateProfileInput } from '~/schemas/profile.schema';
import { ProfileService } from '~/services/profile.service';

export async function updateProfile(data: UpdateProfileInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  return ProfileService.updateProfile(session.user.id, data, session.user.id);
}
