import { withAuth } from "@/src/lib/auth/protected";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "profile",
};

async function Page({ userId }: { userId: string }) {
  return <div>profile for user {userId}</div>;
}

export default withAuth(Page);
