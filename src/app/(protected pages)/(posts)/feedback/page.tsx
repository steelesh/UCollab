import { withAuth } from "@/src/lib/auth/protected";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "code reviews",
};

async function Page({ userId }: { userId: string }) {
  return <div>code reviews for user {userId}</div>;
}

export default withAuth(Page);
