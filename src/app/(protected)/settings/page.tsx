import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '~/lib/prisma';
import { withAuth } from '~/security/protected';

interface SettingsPageProps {
  userId: string;
}

async function SettingsPage({ userId }: SettingsPageProps) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      avatar: true,
      username: true,
      fullName: true,
      email: true,
      createdDate: true,
      gradYear: true,
      mentorship: true,
      NotificationPreferences: {
        select: {
          allowComments: true,
          allowMentions: true,
          allowPostUpdates: true,
          allowSystem: true,
        },
      },
    },
  });

  if (!user) {
    return (
      <div className="absolute inset-0 flex h-full w-full items-center justify-center">
        <p>User not found.</p>
      </div>
    );
  }

  const createdDate = user.createdDate.toISOString().split('T')[0];
  const gradYear = user.gradYear || 'N/A';

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
            <Link href={`/${user.username}`}>
              <button className="btn btn-primary-content">Back</button>
            </Link>
            <button className="btn btn-primary-content">Save</button>
          </div>
        </div>
        <div className="px-8 pt-16 pb-8">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-accent-content flex items-center gap-1 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
              <g fill="currentColor">
                <path d="M16 2c.183 0 .355.05.502.135l.033.02c.28.177.465.49.465.845v1h1a3 3 0 0 1 2.995 2.824L21 7v12a3 3 0 0 1-2.824 2.995L18 22H6a3 3 0 0 1-2.995-2.824L3 19V7a3 3 0 0 1 2.824-2.995L6 4h1V3a1 1 0 0 1 .514-.874l.093-.046l.066-.025l.1-.029l.107-.019L8 2q.083 0 .161.013l.122.029l.04.012l.06.023c.328.135.568.44.61.806L9 3v1h6V3a1 1 0 0 1 1-1" />
                <path d="M9.015 13a1 1 0 0 1-1 1 1.001 1.001 0 1 1-.005-2c.557 0 1.005.448 1.005 1m4 0a1 1 0 0 1-1 1 1.001 1.001 0 1 1-.005-2c.557 0 1.005.448 1.005 1m4.005 0a1 1 0 0 1-1 1 1.001 1.001 0 1 1-.005-2c.557 0 1.005.448 1.005 1m-5 2a1 1 0 0 1 0 2 1.001 1.001 0 1 1-.005-2zm-3.005 1a1 1 0 0 1-1 1 1.001 1.001 0 1 1-.005-2c.557 0 1.005.448 1.005 1" />
              </g>
            </svg>
            Joined {createdDate}
          </p>
          <p className="text-accent-content flex items-center gap-1 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
              <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                <path d="M14 8a2 2 0 0 0-2-2" />
                <path d="M6 8a6 6 0 1 1 12 0c0 4.97-2.686 9-6 9s-6-4.03-6-9m6 9v1a2 2 0 0 1-2 2H7a2 2 0 0 0-2 2" />
              </g>
            </svg>
            Graduating in {gradYear}
          </p>
          <div className="mt-4">
            <div className="flex gap-2 filter">
              <select defaultValue="Mentorship status" className="select select-neutral">
                <option disabled={true}>Mentorship status</option>
                <option>Mentor</option>
                <option>Currently mentored</option>
                <option>Looking for mentorship</option>
              </select>
            </div>
          </div>
          <div className="mt-8">
            <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4">
              <legend className="fieldset-legend">Notifications</legend>
              <label className="fieldset-label flex items-center gap-2">
                <input
                  type="checkbox"
                  defaultChecked={user.NotificationPreferences?.allowComments}
                  className="toggle"
                />
                Comments
              </label>
              <label className="fieldset-label flex items-center gap-2">
                <input
                  type="checkbox"
                  defaultChecked={user.NotificationPreferences?.allowMentions}
                  className="toggle"
                />
                Mentions
              </label>
              <label className="fieldset-label flex items-center gap-2">
                <input
                  type="checkbox"
                  defaultChecked={user.NotificationPreferences?.allowPostUpdates}
                  className="toggle"
                />
                Post Updates
              </label>
              <label className="fieldset-label flex items-center gap-2">
                <input type="checkbox" defaultChecked={user.NotificationPreferences?.allowSystem} className="toggle" />
                System
              </label>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(SettingsPage);
