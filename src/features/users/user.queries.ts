import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { UserService } from './user.service';
import type { UserProfile } from './user.types';
import 'server-only';

const getCachedUserProfile = unstable_cache(
  async (username: string) => {
    return UserService.getUserProfile(username);
  },
  ['user-profile'],
  {
    revalidate: 60,
    tags: ['user-profile'],
  },
);

export const getUserProfile = cache(async (username: string): Promise<UserProfile> => {
  return getCachedUserProfile(username);
});
