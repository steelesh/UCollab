import type { MinimalUserForDirectory, UserProfile } from "./user.types";

import { UserService } from "./user.service";

export async function getUserProfile(username: string): Promise<UserProfile> {
  return UserService.getUserProfile(username);
}

export async function getUserDirectory(): Promise<MinimalUserForDirectory[]> {
  return UserService.getUserDirectory();
}
