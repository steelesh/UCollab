import type { MinimalUserForDirectory, UserProfile } from "./user.types";

import { UserService } from "./user.service";

export async function getUserProfile(username: string): Promise<UserProfile> {
  return UserService.getUserProfile(username);
}

export async function getUserDirectory(page: number, limit: number): Promise<{
  users: MinimalUserForDirectory[];
  totalPages: number;
  currentPage: number;
  limit: number;
  totalCount: number;
}> {
  const { users, totalCount } = await UserService.getUserDirectory(page, limit);
  return {
    users,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
    limit,
    totalCount,
  };
}
