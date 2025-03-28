import type { MinimalUserForDirectory } from "~/features/users/user.types";

import { PageBreadcrumb } from "~/components/navigation/page-breadcrumb";
import { Container } from "~/components/ui/container";
import { Header } from "~/components/ui/header";
import { H1 } from "~/components/ui/heading";
import { UserCard } from "~/components/ui/user-card";
import { getUserDirectory } from "~/features/users/user.queries";
import { withAuth } from "~/security/protected";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "UCollab — User Directory",
};

async function Page() {
  const users: MinimalUserForDirectory[] = await getUserDirectory();

  return (
    <Container>
      <PageBreadcrumb
        items={[
          { label: "User Directory", isCurrent: true },
        ]}
      />
      <Header>
        <H1>User Directory</H1>
      </Header>
      <div className="grid gap-4 sm:grid-cols-2">
        {users.map(user => (
          <UserCard
            key={user.username}
            username={user.username}
            avatar={user.avatar}
            firstName={user.firstName}
            lastName={user.lastName}
            technologies={user.technologies}
          />
        ))}
      </div>
    </Container>
  );
}

export default withAuth(Page);
