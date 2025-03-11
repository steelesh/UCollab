import { Metadata } from 'next';
import EmblaCarousel from '~/components/ui/embla-carousel';
import { EmblaOptionsType } from 'embla-carousel';

export const metadata: Metadata = {
  title: 'UCollab - Home',
  description: 'Welcome to UCollab',
};

const OPTIONS: EmblaOptionsType = { loop: true };
const SLIDES = [
  <div>
    <h2 className="mb-4 text-4xl font-bold">Connect with Peers</h2>
    <p className="mb-4 text-lg">Build your network by connecting with students who share your interests and goals.</p>
    <img src="/images/collab.svg" alt="Connect with Peers" className="w-3/4 py-6" />
  </div>,
  <div>
    <img src="/images/ideas.svg" alt="Discover Projects" className="w-1/2" />
    <h2 className="mb-4 text-4xl font-bold">Discover new Projects</h2>
    <p className="mb-4 text-lg">
      Explore a wide range of student-led projects and find the ones that ignite your passion.
    </p>
  </div>,
  <div>
    <h2 className="mb-4 text-4xl font-bold">Innovate through Collaboration</h2>
    <p className="mb-4 text-lg">Find new and exciting opportunities to help bring your next great idea to fruition.</p>
    <img src="/images/project.svg" alt="Innovate through Collaboration" className="w-1/2 py-2" />
  </div>,
];

export default async function Page() {
  return (
    <>
      <div className="absolute inset-0 flex h-full w-full flex-col items-center overflow-y-auto py-24">
        <section className="flex w-full flex-col items-center justify-center px-4">
          <h1 className="mb-6 text-6xl font-extrabold select-none">Collaborate. Innovate. Succeed.</h1>
          <p className="mb-12 text-2xl select-none">UCollab connects students to work together on exciting projects.</p>
        </section>
        <EmblaCarousel slides={SLIDES} options={OPTIONS} />
      </div>
    </>
  );
}
