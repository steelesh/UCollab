import { withAuth } from '~/lib/auth/protected';

export const metadata = {
  title: 'UCollab — Profile',
};

async function ProfilePage() {
  return (
    <div className="absolute inset-0 flex h-full w-full flex-col items-center overflow-y-auto py-24">
      <div className="card bg-base-300 mt-10 p-8 shadow-2xl">
        <h1 className="text-center text-2xl font-bold select-none">Profile</h1>
      </div>
    </div>
  );
}

export default withAuth(ProfilePage);
