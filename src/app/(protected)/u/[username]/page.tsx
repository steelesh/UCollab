import { withAuth } from '~/security/protected';
import { User } from '@prisma/client';
import { ProfileUserInfo } from './components/profile-user-info';
import { ProfileHeader } from './components/profile-header';
import { ProfileProjectsList } from './components/profile-projects-list';
import { ProfileCommentsList } from './components/profile-comments-list';
import { getUserProfile } from '~/features/users/user.queries';
import { preloadUserProfile } from '~/features/users/user.queries';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    username: User['username'];
  }>;
  userId: User['id'];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { username } = await params;
    const userProfile = await getUserProfile(username);

    return {
      title: `${userProfile.fullName} (@${userProfile.username}) | UCollab`,
    };
  } catch {
    return {
      title: 'User Not Found | UCollab',
    };
  }
}

async function Page({ params, userId }: PageProps) {
  const { username } = await params;
  preloadUserProfile(username);
  const userProfile = await getUserProfile(username);

  return (
    <main className="absolute inset-0 flex h-full w-full flex-col items-center overflow-y-auto py-8">
      <article className="w-full max-w-3xl rounded shadow">
        <ProfileHeader
          avatar={userProfile.avatar}
          username={userProfile.username}
          isOwnProfile={userId === userProfile.id}
        />
        <div className="px-8 pt-14 pb-8">
          <h1 className="pb-2 text-2xl font-bold">{userProfile.fullName}</h1>
          <ProfileUserInfo
            createdDate={userProfile.createdDate}
            gradYear={userProfile.gradYear}
            mentorship={userProfile.mentorship}
            bio={userProfile.bio}
          />
          <section className="mt-8 border-t pt-4">
            <h2 className="text-md italic">Latest posts...</h2>
            <ProfileProjectsList projects={userProfile.projects} />
          </section>
          <section className="pt-4">
            <h2 className="text-md italic">Latest comments...</h2>
            <ProfileCommentsList comments={userProfile.comments} />
          </section>
        </div>
      </article>
    </main>
  );
}

export default withAuth(Page);
