import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '~/lib/prisma';
import { withAuth } from '~/security/protected';
import { updateUser } from '~/features/users/user.actions';
import { Route } from 'next';

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
      bio: true,
      createdDate: true,
      gradYear: true,
      mentorship: true,
      notificationPreferences: {
        select: {
          allowComments: true,
          allowMentions: true,
          allowProjectUpdates: true,
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

  return (
    <form
      action={updateUser}
      className="absolute inset-0 flex h-full w-full flex-col items-center overflow-y-auto py-8">
      <input type="hidden" name="userId" value={userId} />
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
            <Link href={`/u/${user.username}` as Route}>
              <button type="button" className="btn btn-primary-content">
                Back
              </button>
            </Link>
            <button type="submit" className="btn btn-primary-content">
              Save
            </button>
          </div>
        </div>
        <div className="px-8 pt-14 pb-8">
          <h1 className="pb-2 text-2xl font-bold">Settings</h1>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Graduation Year</legend>
            <input
              type="number"
              name="gradYear"
              className="input"
              defaultValue={user.gradYear ?? ''}
              placeholder="Graduation Year"
            />
          </fieldset>
          <div className="mt-4">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Mentorship Status</legend>
              <div className="flex gap-2 filter">
                <select name="mentorship" defaultValue={user.mentorship || 'NONE'} className="select select-neutral">
                  <option value="MENTOR">Mentor</option>
                  <option value="MENTEE">Mentee</option>
                  <option value="NONE">None</option>
                </select>
              </div>
            </fieldset>
          </div>
          <div className="mt-4">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Your bio</legend>
              <textarea name="bio" className="textarea h-24" placeholder="Bio" defaultValue={user.bio || ''}></textarea>
              <div className="fieldset-label">Optional</div>
            </fieldset>
          </div>
          <div className="mt-4">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Avatar</legend>
              <input type="file" name="avatar" accept="image/*" className="file-input" />
            </fieldset>
          </div>
          <div className="mt-8">
            <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4">
              <legend className="fieldset-legend">Notifications</legend>
              <label className="fieldset-label flex items-center gap-2">
                <input
                  type="checkbox"
                  name="allowComments"
                  defaultChecked={user.notificationPreferences?.allowComments}
                  className="toggle"
                />
                Comments
              </label>
              <label className="fieldset-label flex items-center gap-2">
                <input
                  type="checkbox"
                  name="allowMentions"
                  defaultChecked={user.notificationPreferences?.allowMentions}
                  className="toggle"
                />
                Mentions
              </label>
              <label className="fieldset-label flex items-center gap-2">
                <input
                  type="checkbox"
                  name="allowProjectUpdates"
                  defaultChecked={user.notificationPreferences?.allowProjectUpdates}
                  className="toggle"
                />
                Projects
              </label>
              <label className="fieldset-label flex items-center gap-2">
                <input
                  type="checkbox"
                  name="allowSystem"
                  defaultChecked={user.notificationPreferences?.allowSystem}
                  className="toggle"
                />
                System
              </label>
            </fieldset>
          </div>
        </div>
      </div>
    </form>
  );
}

export default withAuth(SettingsPage);
