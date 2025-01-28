import { auth } from "@/auth";
import { ModeToggle } from "@/src/components/ui/color-mode-toggle";
import { H2 } from "@/src/components/ui/h2";
import { UserService } from "@/src/services/user.service";
import { DevInfoBanner } from "../../../components/blocks/users-page/dev-info-banner";
import { UserGrid } from "../../../components/blocks/users-page/user-grid";

export default async function Page() {
  // get session
  const session = await auth();
  // Get users
  const users = await UserService.getDirectoryUsers();

  // Sort users: current user first, then admin, then by creation date
  const sortedUsers = users.sort((a, b) => {
    if (a.id === session?.user?.id) return -1;
    if (b.id === session?.user?.id) return 1;
    if (a.username === "admin") return -1;
    if (b.username === "admin") return 1;
    return b.createdDate.getTime() - a.createdDate.getTime();
  });

  return (
    <div className="space-y-8">
      <H2>User directory</H2>
      <ModeToggle />
      <DevInfoBanner />
      <UserGrid users={sortedUsers} currentUserId={session?.user?.id} />
    </div>
  );
}
