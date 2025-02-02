import { UserService } from '~/services/user.service';
import { NextRequest } from 'next/server';

export async function GET(_req: NextRequest, { params }: { params: { username: string } }) {
  return UserService.getUser(params.username);
}
