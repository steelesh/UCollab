import { withAuth } from "@/src/lib/auth/protected";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "tags",
};

async function Page({ userId }: { userId: string }) {
  return <div>tags for user {userId}</div>;
}

export default withAuth(Page);
