import { SignInForm } from "@/src/components/blocks/auth/signin-form";

export default function Page() {
  return (
    <div className="mt-16 flex items-center justify-center">
      <div className="w-full max-w-[400px]">
        <SignInForm />
      </div>
    </div>
  );
}
