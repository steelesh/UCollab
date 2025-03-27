"use client";

import type { User } from "@prisma/client";
import type { Route } from "next";

import { format } from "date-fns";
import { Bookmark, BookmarkCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { ProjectDetails } from "~/features/projects/project.types";

import { StarDisplay } from "~/components/ui/star-rating";
import { getBookmarkStatus, toggleBookmark } from "~/features/projects/project.actions";

import { ProjectRating } from "./project-rating";

type ProjectInfoProps = {
  project: ProjectDetails;
  userId: User["id"];
  userProjectRating: number;
  initBookmarked: boolean;
};

export function ProjectInfo({ project, userId, userProjectRating, initBookmarked }: ProjectInfoProps) {
  const created = format(new Date(project.createdDate), "yyyy-MM-dd");
  const modified = format(new Date(project.lastModifiedDate), "yyyy-MM-dd");
  const isOwnProject = project.createdById === userId;
  const hasRating = project.rating > 0;
  const [isBookmarked, setIsBookmarked] = useState(initBookmarked);

  useEffect(() => {
    async function fetchBookmarkStatus() {
      const result = (await getBookmarkStatus(project.id)) as { success: boolean; bookmarked: boolean };
      if (result.success) {
        setIsBookmarked(result.bookmarked);
      }
    }
    fetchBookmarkStatus();
  }, [project.id]);

  const handleBookmarkToggle = async () => {
    const result = (await toggleBookmark(project.id)) as { success: boolean; watched: boolean };
    if (result.success) {
      setIsBookmarked(result.watched);
    }
  };

  return (
    <div>
      <div>
        <p className="text-muted-foreground flex items-center gap-1 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
            <g fill="currentColor">
              <path d="M16 2c.183 0 .355.05.502.135l.033.02c.28.177.465.49.465.845v1h1a3 3 0 0 1 2.995 2.824L21 7v12a3 3 0 0 1-2.824 2.995L18 22H6a3 3 0 0 1-2.995-2.824L3 19V7a3 3 0 0 1 2.824-2.995L6 4h1V3a1 1 0 0 1 .514-.874l.093-.046l.066-.025l.1-.029l.107-.019L8 2q.083 0 .161.013l.122.029l.04.012l.06.023c.328.135.568.44.61.806L9 3v1h6V3a1 1 0 0 1 1-1" />
            </g>
          </svg>
          Created:
          {" "}
          {created}
        </p>
        {modified && (
          <p className="text-muted-foreground flex items-center gap-1 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24">
              <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                <path d="M14 8a2 2 0 0 0-2-2" />
                <path d="M6 8a6 6 0 1 1 12 0c0 4.97-2.686 9-6 9s-6-4.03-6-9m6 9v1a2 2 0 0 1-2 2H7a2 2 0 0 0-2 2" />
              </g>
            </svg>
            Last updated:
            {" "}
            {modified}
          </p>
        )}
        <p className="text-muted-foreground flex items-center gap-1 text-sm">
          Type:
          {" "}
          {project.projectType.charAt(0).toUpperCase() + project.projectType.slice(1).toLowerCase()}
        </p>
        <div className="text-muted-foreground flex items-center gap-1 text-sm">
          Rating:
          {hasRating ? <StarDisplay rating={project.rating} size="sm" showValue={true} /> : <span>No ratings yet</span>}
        </div>
        {project.githubRepo && (
          <p className="flex items-center gap-1 text-sm">
            <Link
              href={`${project.githubRepo}` as Route}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              GitHub Repo
            </Link>
          </p>
        )}
      </div>
      <div
        role="button"
        tabIndex={0}
        onClick={handleBookmarkToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleBookmarkToggle();
          }
        }}
        className="cursor-pointer focus:outline-none"
      >
        {isBookmarked ? <BookmarkCheck size={24} className="text-yellow-500" /> : <Bookmark size={24} />}
      </div>
      <div className="mt-4">
        <p className="text-md">{project.description}</p>
      </div>
      {project.technologies && project.technologies.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <p className="text-sm font-semibold">Technologies:</p>
          <ul className="list-disc pl-5">
            {project.technologies.map(tech => (
              <li key={tech.id} className="text-sm">
                {tech.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      {!isOwnProject && (
        <ProjectRating projectId={project.id} initialRating={project.rating} userRating={userProjectRating} />
      )}
    </div>
  );
}
