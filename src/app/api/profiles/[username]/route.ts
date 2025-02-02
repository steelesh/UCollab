import { ProfileService } from '~/services/profile.service';
import { NextRequest } from 'next/server';

export async function GET(_req: NextRequest, { params }: { params: { username: string } }) {
  return ProfileService.getPublicProfile(params.username);
}
