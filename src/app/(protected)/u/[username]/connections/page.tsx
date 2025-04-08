import type { User } from "@prisma/client";

import { PageBreadcrumb } from "~/components/navigation/page-breadcrumb";
import { Pagination } from "~/components/navigation/pagination";
import { Container } from "~/components/ui/container";
import { Header } from "~/components/ui/header";
import { H1 } from "~/components/ui/heading";
import { UserCard } from "~/components/ui/user-card";
import { getUserConnections } from "~/features/users/user.queries";
import { withAuth } from "~/security/protected";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "UCollab — My Connections",
};

type PageProps = {
  readonly params: Promise<{ username: User["username"] }>;
  readonly searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  readonly userId: User["id"];
};

async function Page({ params, searchParams, userId }: PageProps) {
  const { username } = await params;
  const { page = "1", limit = "12" } = await searchParams;

  const data = await getUserConnections(userId, Number(page), Number(limit));

  return (
    <Container>
      <PageBreadcrumb
        items={[
          { label: "My Connections", isCurrent: true },
        ]}
      />
      <Header>
        <H1>My Connections</H1>
      </Header>
      <div className="grid gap-4 md:grid-cols-2">
        {data.users.map(user => (
          <UserCard
            key={user.username}
            username={user.username}
            avatar={user.avatar}
            firstName={user.firstName}
            lastName={user.lastName}
            email={user.email}
            gradYear={user.gradYear}
            technologies={user.technologies}
            mentorship={user.mentorship}
          />
        ))}
      </div>
      <Pagination
        currentPage={data.currentPage}
        totalPages={data.totalPages}
        totalCount={data.totalCount}
        limit={data.limit}
        itemsPerPageOptions={[12, 24, 36, 48]}
        basePath={`/u/${username}/connections`}
        itemName="connections"
      />
    </Container>
  );
}

export default withAuth(Page);
