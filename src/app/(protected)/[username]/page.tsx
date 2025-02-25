import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '~/lib/prisma';
import { withAuth } from '~/security/protected';
import SignOutButton from '~/components/signout-button';
import type { Route } from 'next';

interface ProfileRouteProps {
  params: { username: string };
}

type Props = ProfileRouteProps & { userId: string };

async function ProfilePage({ params }: Props) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      avatar: true,
      username: true,
      email: true,
      fullName: true,
      createdDate: true,
      lastLogin: true,
      gradYear: true,
      mentorship: true,
      bio: true,
      skills: {
        select: { name: true },
      },
      comments: {
        select: { content: true },
      },
      projects: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!user) {
    return (
      <div className="absolute inset-0 flex h-full w-full flex-col items-center overflow-y-auto py-24">
        <p>User not found.</p>
      </div>
    );
  }

  const createdDate = user.createdDate.toISOString().split('T')[0];
  const gradYear = user.gradYear || '';
  const latestProjects = user.projects && user.projects.length > 0 ? user.projects.slice(-3).reverse() : [];
  const latestComments = user.comments && user.comments.length > 0 ? user.comments.slice(-3).reverse() : [];
  const biography = user.bio?.toString() || 'N/A';

  return (
    <div className="absolute inset-0 flex h-full w-full flex-col items-center overflow-y-auto py-8">
      <div className="w-full max-w-3xl rounded shadow">
        <div className="relative h-48">
          <Image src="/banner-placeholder.png" alt="Banner" fill className="rounded-t object-cover" />
          <div className="absolute -bottom-12 left-8">
            <Image
              src={user.avatar}
              alt={user.username}
              width={100}
              height={100}
              className="border-base-100 rounded-full border-5"
            />
          </div>
          <div className="absolute right-1 -bottom-12 flex space-x-2">
            <Link href={`/settings` as Route} className="font-bold hover:underline">
              <button className="btn btn-accent-content">
                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
                  <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37c1 .608 2.296.07 2.572-1.065"></path>
                    <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0-6 0"></path>
                  </g>
                </svg>
              </button>
            </Link>
            <SignOutButton />
          </div>
        </div>
        <div className="px-8 pt-14 pb-8">
          <h1 className="pb-2 text-2xl font-bold">{user.fullName || user.username}</h1>
          <p className="text-accent-content flex items-center gap-1 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
              <g fill="currentColor">
                <path d="M16 2c.183 0 .355.05.502.135l.033.02c.28.177.465.49.465.845v1h1a3 3 0 0 1 2.995 2.824L21 7v12a3 3 0 0 1-2.824 2.995L18 22H6a3 3 0 0 1-2.995-2.824L3 19V7a3 3 0 0 1 2.824-2.995L6 4h1V3a1 1 0 0 1 .514-.874l.093-.046l.066-.025l.1-.029l.107-.019L8 2q.083 0 .161.013l.122.029l.04.012l.06.023c.328.135.568.44.61.806L9 3v1h6V3a1 1 0 0 1 1-1"></path>
                <path d="M9.015 13a1 1 0 0 1-1 1a1.001 1.001 0 1 1-.005-2c.557 0 1.005.448 1.005 1m4 0a1 1 0 0 1-1 1a1.001 1.001 0 1 1-.005-2c.557 0 1.005.448 1.005 1m4.005 0a1 1 0 0 1-1 1a1.001 1.001 0 1 1-.005-2c.557 0 1.005.448 1.005 1m-5 2a1 1 0 0 1 0 2a1.001 1.001 0 1 1-.005-2zm-3.005 1a1 1 0 0 1-1 1a1.001 1.001 0 1 1-.005-2c.557 0 1.005.448 1.005 1"></path>
              </g>
            </svg>
            Joined {createdDate}
          </p>
          <p className="text-accent-content flex items-center gap-1 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
              <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                <path d="M14 8a2 2 0 0 0-2-2"></path>
                <path d="M6 8a6 6 0 1 1 12 0c0 4.97-2.686 9-6 9s-6-4.03-6-9m6 9v1a2 2 0 0 1-2 2H7a2 2 0 0 0-2 2"></path>
              </g>
            </svg>
            Graduating in {gradYear}
          </p>
          <p className="text-accent-content flex items-center gap-1 text-sm">
            {user.mentorship === 'MENTOR' ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                  <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3m9-9V7a2 2 0 0 0-2-2h-2m-2 12v-1a1 1 0 0 1 1-1h1m3 0h1a1 1 0 0 1 1 1v1m0 3v1a1 1 0 0 1-1 1h-1m-3 0h-1a1 1 0 0 1-1-1v-1"></path>
                    <path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2"></path>
                  </g>
                </svg>
              </>
            ) : user.mentorship === 'MENTEE' ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                  <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"></path>
                    <path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2m0 9l2 2l4-4"></path>
                  </g>
                </svg>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
                  <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4.5M19 11V7a2 2 0 0 0-2-2h-2"></path>
                    <path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2m6 13a3 3 0 1 0 6 0a3 3 0 1 0-6 0m5.2 2.2L22 22"></path>
                  </g>
                </svg>
              </>
            )}
            {user.mentorship === 'MENTOR'
              ? 'Mentor'
              : user.mentorship === 'MENTEE'
                ? 'Currently mentored'
                : 'Looking for mentorship'}
          </p>
          <div className="mt-4">
            <div className="text-sm italic">
              {biography.length > 0 ? (
                <p className="text-sm">{biography}</p>
              ) : (
                <p className="text-accent-content text-sm">No bio available.</p>
              )}
            </div>
          </div>
          <div className="mt-8 border-t pt-4">
            <h2 className="text-md italic">Latest posts...</h2>
            {latestProjects.length > 0 ? (
              <ul className="list-item py-4 pl-5 text-sm">
                {latestProjects.map((projects, idx) => (
                  <li key={idx}>
                    <Link href={`/projects/${projects.id}` as Route} className="font-bold hover:underline">
                      {projects.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-accent-content text-sm">No posts available.</p>
            )}
          </div>
          <div className="pt-4">
            <h2 className="text-md italic">Latest comments...</h2>
            {latestComments.length > 0 ? (
              <ul className="list-item py-4 pl-5 text-sm">
                {latestComments.map((comment, idx) => (
                  <li key={idx}>{comment.content}</li>
                ))}
              </ul>
            ) : (
              <p className="text-accent-content pt-2 text-sm">No comments available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(ProfilePage);
