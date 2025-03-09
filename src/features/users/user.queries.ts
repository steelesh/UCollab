import { UserService } from './user.service';
import type { UserProfile } from './user.types';

export async function getUserProfile(username: string): Promise<UserProfile> {
  return UserService.getUserProfile(username);
}
