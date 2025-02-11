import { withApiAuth } from '~/lib/auth/protected-api';
import { UserService } from '~/services/user.service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  return withApiAuth(null, async (userId) => {
    const formData = await req.formData();
    const gradYear = formData.get('gradYear')?.toString();
    const skills = formData.get('skills')?.toString();
    const githubProfile = formData.get('githubProfile')?.toString();
    const postType = formData.get('postType')?.toString();

    await UserService.completeOnboarding(userId, userId, {
      gradYear,
      skills,
      githubProfile,
      postType,
    });

    return NextResponse.redirect(new URL('/', req.url), 302);
  });
}
