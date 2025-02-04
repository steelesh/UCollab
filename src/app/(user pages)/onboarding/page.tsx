import { withOnboarding } from "@/src/lib/auth/protected";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "onboarding",
};

async function Page({ userId }: { userId: string }) {
  return <div>onboarding for user {userId}</div>;
}

export default withOnboarding(Page);
