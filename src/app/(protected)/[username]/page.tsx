import Image from 'next/image';
import { prisma } from '~/lib/prisma';
import { withAuth } from '~/security/protected';

// Define the dynamic route props
interface ProfileRouteProps {
  params: { username: string };
}

// Combine the route props with the auth-injected prop
type Props = ProfileRouteProps & { userId: string };

async function ProfilePage({ params, _userId }: Props) {
  const { username } = params;

  // Fetch the profile data based on the route username
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      avatar: true,
      username: true,
      email: true,
      fullName: true,
      createdDate: true,
      lastLogin: true,
    },
  });

  if (!user) {
    return (
      <div className="absolute inset-0 flex h-full w-full flex-col items-center overflow-y-auto py-24">
        <p>User not found.</p>
      </div>
    );
  }

  // Format the dates for display
  const createdDate = user.createdDate.toISOString().split('T')[0];
  const lastLogin = user.lastLogin.toISOString().split('T')[0];

  return (
    <div className="absolute inset-0 flex h-full w-full flex-col items-center overflow-y-auto py-8">
      <div className="w-full max-w-3xl rounded shadow">
        {/* Banner Section */}
        <div className="relative h-48">
          <Image
            src="/banner-placeholder.png" // Use a user-specific banner if available
            alt="Banner"
            fill
            className="rounded-t object-cover"
          />
          {/* Overlapping Avatar */}
          <div className="absolute -bottom-12 left-8">
            <Image
              src={user.avatar}
              alt={user.username}
              width={100}
              height={100}
              className="border-base-100 rounded-full border-5"
            />
          </div>
          {/* Action Buttons on the opposite side */}
          <div className="absolute right-1 -bottom-12 flex space-x-2">
            <button className="btn btn-accent-content">
              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
                <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                  <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37c1 .608 2.296.07 2.572-1.065"></path>
                  <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0-6 0"></path>
                </g>
              </svg>
            </button>
            <button className="btn btn-accent-content">Sign Out</button>
          </div>
        </div>
        {/* Profile Details */}
        <div className="px-8 pt-16 pb-8">
          <h1 className="text-2xl font-bold">{user.fullName || user.username}</h1>
          <p className="text-accent-content">@{user.username}</p>
          <div className="mt-4 flex space-x-8">
            <div>
              <p className="text-sm font-semibold">Joined</p>
              <p className="text-accent-content text-sm">{createdDate}</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Last Active</p>
              <p className="text-accent-content text-sm">{lastLogin}</p>
            </div>
          </div>
          {/* Placeholder Bio */}
          <div className="mt-4">
            <p>This is a placeholder bio for {user.username}. More info about the user can go here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(ProfilePage);
