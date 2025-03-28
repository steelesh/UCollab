import type { User } from "@prisma/client";

import { PageBreadcrumb } from "~/components/navigation/page-breadcrumb";
import { Container } from "~/components/ui/container";
import { Header } from "~/components/ui/header";
import { H1 } from "~/components/ui/heading";
import { Pagination } from "~/components/ui/pagination";
import { UserCard } from "~/components/ui/user-card";
import { getUserDirectory } from "~/features/users/user.queries";
import { withAuth } from "~/security/protected";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "UCollab — User Directory",
};

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  userId: User["id"];
};

async function Page({ searchParams }: PageProps) {
  const { page = "1", limit = "12" } = await searchParams;
  const data = await getUserDirectory(Number(page), Number(limit));

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
      <div className="grid gap-4 lg:grid-cols-2">
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
        basePath="/u"
        itemName="users"
      />
    </Container>
  );
}

export default withAuth(Page);
