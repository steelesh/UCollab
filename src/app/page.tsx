import { auth } from "@/auth";
import { Metadata } from "next";
import { AuthenticatedHomePage } from "../components/blocks/homepage/authenticated-homepage";
import { PublicHomePage } from "../components/blocks/homepage/public-homepage";
import { UserService } from "../services/user.service";

// metadata
export const metadata: Metadata = {
  title: "home",
};

export default async function Page() {
  // get session
  const session = await auth();

  // if no session, show public home page
  if (!session?.user?.id) {
    return <PublicHomePage />;
  }

  // since there is a session, get user
  const user = await UserService.getHomePageUser(
    session.user.id,
    session.user.id,
  );

  // if no user, show public home page
  if (!user) {
    return <PublicHomePage />;
  }

  // since there is a user with a valid session, show authenticated home page
  return <AuthenticatedHomePage user={user} />;
}
