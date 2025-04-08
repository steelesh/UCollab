import type { Metadata } from "next";

import { DotPattern } from "~/components/magicui/dot-pattern";
import { SignInWrapper } from "~/components/navigation/signin-wrapper";
import { ActivityCard, NoActivityPlaceholder } from "~/components/posts/activity-card";
import { PostCardXs } from "~/components/posts/post-card-xs";
import { Container } from "~/components/ui/container";
import { H1, H3 } from "~/components/ui/heading";
import { getUserRecentActivity } from "~/features/posts/post.actions";
import { getTopTrendingPosts } from "~/features/posts/post.queries";
import { cn } from "~/lib/utils";
import { auth } from "~/security/auth";

export const metadata: Metadata = {
  title: "UCollab - Home",
  description: "Welcome to UCollab",
};

export default async function Page() {
  const session = await auth();
  if (session?.user?.id) {
    const trendingPosts = await getTopTrendingPosts(session.user.id);

    const activityData = await getUserRecentActivity(5);
    const activities = activityData?.success ? activityData.activities : [];
    const hasActivity = activityData?.hasActivity ?? false;

    return (
      <>
        <div className="absolute inset-0 -z-10">
          <DotPattern
            className={cn(
              "[mask-image:radial-gradient(500px_circle_at_top,white,transparent)]",
            )}
          />
        </div>
        <div className="flex w-full flex-col items-center justify-center cursor-default select-none">
          <H1 className="mt-12 text-5xl font-medium select-none text-center">
            Welcome back,
            {" "}
            <span className="font-thin">{session.user.username}</span>
            {/* */}
            !
          </H1>
          <H3 className="mt-8">Trending Posts</H3>
          {trendingPosts.length > 0
            ? (
                <div className="grid gap-4 lg:grid-cols-2 mt-4">
                  {trendingPosts.map(post => (
                    <PostCardXs
                      key={post.id}
                      id={post.id}
                      title={post.title}
                      technologies={post.technologies}
                      postNeeds={post.postNeeds}
                      user={{
                        username: post.createdBy.username,
                        avatar: post.createdBy.avatar,
                      }}
                    />
                  ))}
                </div>
              )
            : (
                <p className="mt-2">No trending posts to display.</p>
              )}
          <H3 className="mt-12">Recent Activity</H3>
          {hasActivity
            ? (
                <Container size="xl" className="mt-4 space-y-3">
                  {activities.map(activity => (
                    <ActivityCard key={`${activity.type}-${activity.id}`} activity={activity} />
                  ))}
                </Container>
              )
            : (
                <NoActivityPlaceholder />
              )}
        </div>
      </>
    );
  }
  return (
    <>
      <div className="absolute inset-0 -z-10">
        <DotPattern
          className={cn(
            "[mask-image:radial-gradient(500px_circle_at_top,white,transparent)]",
          )}
        />
      </div>
      <div className="flex w-full flex-col items-center justify-center">
        <h1 className="mt-12 text-5xl font-extrabold select-none text-center">
          Connect. Innovate. Succeed.
        </h1>
        <p className="mb-18 text-lg font-thin italic select-none mt-2">
          Empowering students through collaboration.
        </p>
        <SignInWrapper />
      </div>
    </>
  );
}
