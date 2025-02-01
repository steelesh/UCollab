import { auth } from "@/auth";
import { ErrorMessage } from "@/src/lib/constants";
import { UpdateProfileInput } from "@/src/schemas/profile.schema";
import { ProfileService } from "@/src/services/profile.service";

export async function updateProfile(data: UpdateProfileInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  return ProfileService.updateProfile(session.user.id, data, session.user.id);
}
