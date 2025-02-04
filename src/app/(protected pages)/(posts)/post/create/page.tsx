import { withAuth } from "@/src/lib/auth/protected";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "create post",
};

async function Page({ userId }: { userId: string }) {
  return <div>create post for user {userId}</div>;
}

export default withAuth(Page);
