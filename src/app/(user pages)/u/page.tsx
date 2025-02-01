import { auth } from "@/auth";
import { DevInfoBanner } from "@/src/components/blocks/users-page/dev-info-banner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";
import { H2 } from "@/src/components/ui/h2";
import { withProtected } from "@/src/lib/auth/protected";
import { Permission } from "@/src/lib/permissions";
import { isDevelopment } from "@/src/lib/utils";
import { UserService } from "@/src/services/user.service";
import { UserGrid } from "../../../components/blocks/users-page/user-grid";

async function Page() {
  const session = await auth();
  const userId = session?.user?.id;

  const users = await UserService.getUsers(userId);

  const sortedUsers = users.sort((a, b) => {
    if (a.id === userId) return -1;
    if (b.id === userId) return 1;
    return b.createdDate.getTime() - a.createdDate.getTime();
  });

  return (
    <div className="space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>User Directory</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <H2>User Directory</H2>
      <DevInfoBanner />
      <UserGrid
        users={sortedUsers}
        currentUserId={userId}
        showImpersonateButton={isDevelopment()}
      />
    </div>
  );
}

export default isDevelopment()
  ? Page
  : withProtected(Page, [Permission.VIEW_USERS_LIST]);
