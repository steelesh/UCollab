import { withAuth } from "@/src/lib/auth/protected";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "trending posts",
};

async function Page({ userId }: { userId: string }) {
  return <div>trending posts for user {userId}</div>;
}

export default withAuth(Page);
