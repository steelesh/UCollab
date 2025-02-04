import { withAuth } from "@/src/lib/auth/protected";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "all posts",
};

async function Page({ userId }: { userId: string }) {
  return <div>all posts (User ID: {userId})</div>;
}

export default withAuth(Page);
