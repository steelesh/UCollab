import { withAuth } from "@/src/lib/auth/protected";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "collaborations",
};

async function Page({ userId }: { userId: string }) {
  return <div>collaborations for user {userId}</div>;
}

export default withAuth(Page);
