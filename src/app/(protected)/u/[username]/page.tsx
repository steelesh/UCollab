import type { User } from "@prisma/client";
import type { Metadata } from "next";

import { ProfileCommentsList } from "~/components/profiles/profile-comments-list";
import { ProfileHeader } from "~/components/profiles/profile-header";
import { ProfilePostsList } from "~/components/profiles/profile-posts-list";
import { ProfileUserInfo } from "~/components/profiles/profile-user-info";
import { getUserProfile, isUserConnected } from "~/features/users/user.queries";
import { withAuth } from "~/security/protected";

type PageProps = {
  readonly params: Promise<{ username: User["username"] }>;
  readonly userId: User["id"];
};

export async function generateMetadata({ params }: { params: Promise<{ username: User["username"] }> }): Promise<Metadata> {
  try {
    const { username } = await params;
    const userProfile = await getUserProfile(username);

    return {
      title: `${userProfile.fullName} (@${userProfile.username}) | UCollab`,
    };
  } catch {
    return {
      title: "User Not Found | UCollab",
    };
  }
}

async function Page({ params, userId }: PageProps) {
  const { username } = await params;
  const userProfile = await getUserProfile(username);

  let initialConnected = false;
  if (userId !== userProfile.id) {
    initialConnected = await isUserConnected(userProfile.username, userId);
  }

  return (
    <div className="flex flex-col items-center">
      <article className="w-full max-w-3xl rounded shadow">
        <ProfileHeader
          avatar={userProfile.avatar}
          username={userProfile.username}
          isOwnProfile={userId === userProfile.id}
          initialConnected={initialConnected}
        />
        <div className="px-8 pt-14 pb-8">
          <h1 className="pb-2 text-2xl font-bold">{userProfile.fullName}</h1>
          <ProfileUserInfo
            createdDate={userProfile.createdDate}
            gradYear={userProfile.gradYear}
            mentorship={userProfile.mentorship}
            technologies={userProfile.technologies}
            bio={userProfile.bio}
          />
          <section className="mt-8 border-t pt-4">
            <h2 className="text-md italic">Latest posts...</h2>
            <ProfilePostsList posts={userProfile.posts} />
          </section>
          <section className="pt-4">
            <h2 className="text-md italic">Latest comments...</h2>
            <ProfileCommentsList comments={userProfile.comments} />
          </section>
        </div>
      </article>
    </div>
  );
}

export default withAuth(Page);
