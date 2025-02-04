import { withAuth } from "@/src/lib/auth/protected";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "settings",
};

async function Page({ userId }: { userId: string }) {
  return <div>settings for user {userId}</div>;
}

export default withAuth(Page);
