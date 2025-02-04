import { Metadata } from 'next';
import SignInButton from '@components/signin-button';

export const metadata: Metadata = {
  title: 'UCollab - Home',
  description: 'Welcome to UCollab',
};

export default async function Page() {
  return (
    <div className="absolute inset-0 flex h-full w-full flex-col items-center overflow-y-auto py-24">
      <section className="flex w-full flex-col items-center justify-center px-4 py-32">
        <h1 className="mb-6 text-6xl font-extrabold select-none">Collaborate. Innovate. Succeed.</h1>
        <p className="mb-12 text-2xl select-none">UCollab connects students to work together on exciting projects.</p>
        <SignInButton />
      </section>

      <section className="w-full px-4 py-32">
        <div className="mx-auto flex max-w-6xl flex-col items-center md:flex-row">
          <h2 className="mb-4 text-4xl font-bold">Connect with Peers</h2>
          <p className="mb-4 text-lg">
            Build your network by connecting with students who share your interests and goals.
          </p>
          <img src="/collab.svg" alt="Connect with Peers" className="w-full" />
        </div>
      </section>

      <section className="w-full px-4 py-32">
        <div className="mx-auto flex max-w-6xl flex-col items-center md:flex-row">
          <img src="/ideas.svg" alt="Discover Projects" className="w-full px-12" />
          <h2 className="mb-4 text-4xl font-bold">Discover new Projects</h2>
          <p className="mb-4 text-lg">
            Explore a wide range of student-led projects and find the ones that ignite your passion.
          </p>
        </div>
      </section>
    </div>
  );
}
