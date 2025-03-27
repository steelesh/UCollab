import type { Project } from "@prisma/client";

import Link from "next/link";

import { getBookmarkedProjects } from "~/features/projects/project.actions";
import { withAuth } from "~/security/protected";

export const metadata = {
  title: "UCollab — My Bookmarks",
};

async function Page() {
  const { success, projects } = (await getBookmarkedProjects()) as { success: boolean; projects: Project[] };

  if (!success) {
    return <div>Error loading bookmarked projects.</div>;
  }

  return (
    <div className="flex flex-col items-center">
      {projects.map((project: Project) => (
        <div key={project.id} className="flex w-full max-w-3xl items-center border-b p-4">
          <div className="flex flex-col">
            <Link href={`/p/${project.id}`} className="font-bold hover:underline">
              {project.title}
            </Link>
            <p className="text-muted-foreground text-sm">
              Created:
              {" "}
              {new Date(project.createdDate).toISOString().split("T")[0]}
              {" "}
              | Rating:
              {" "}
              {project.rating}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default withAuth(Page);
