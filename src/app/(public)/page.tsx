import type { Metadata } from "next";

import { DotPattern } from "~/components/magicui/dot-pattern";
import { SignInWrapper } from "~/components/navigation/signin-wrapper";
import { cn } from "~/lib/utils";

export const metadata: Metadata = {
  title: "UCollab - Home",
  description: "Welcome to UCollab",
};

export default function Page() {
  return (
    <>
      <div className="absolute inset-0 -z-10">
        <DotPattern className={cn("[mask-image:radial-gradient(500px_circle_at_top,white,transparent)]")} />
      </div>
      <div className="flex w-full flex-col items-center justify-center">
        <h1 className="mt-12 text-5xl font-extrabold select-none">Connect. Innovate. Succeed.</h1>
        <p className="mb-18 text-lg font-thin italic select-none">Empowering students through collaboration.</p>
        <SignInWrapper />
      </div>
    </>
  );
}
