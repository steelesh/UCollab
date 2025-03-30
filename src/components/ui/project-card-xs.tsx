import type { Project, ProjectType, User } from "@prisma/client";

import Link from "next/link";

import type { Technology } from "~/features/projects/project.types";

import { Avatar, AvatarImage } from "./avatar";
import { Badge } from "./badge";
import { Card } from "./card";
import { ProjectTypeBadge } from "./project-badges";
import { Small } from "./small";
import { TechnologyIcon } from "./technology-icon";

type ProjectCardXsProps = {
  id: Project["id"];
  title: Project["title"];
  technologies: Technology[];
  githubRepo: Project["githubRepo"];
  projectType: ProjectType;
  user: {
    username: User["username"];
    avatar: User["avatar"];
  };
  watchers: {
    id: User["id"];
    user: {
      username: User["username"];
      avatar: User["avatar"];
    };
  }[];
};

export function ProjectCardXs({
  id,
  title,
  technologies,
  projectType,
  user,
}: ProjectCardXsProps) {
  const displayTechnologies = technologies.slice(0, 4);
  const hasMoreTechnologies = technologies.length > 4;

  return (
    <Link
      href={`/p/${id}`}
      className="block group transition-transform duration-300 transform hover:scale-102 hover:subpixel-antialiased"
    >
      <Card variant="glossy" className="w-48 h-48 p-2 relative backface-hidden">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <div className="mb-1">
              <Small className="whitespace-normal break-words underline-offset-4 underline">
                {title}
              </Small>
            </div>
            <div className="space-y-1">
              <ProjectTypeBadge type={projectType} className="px-2" />
              <div className="flex flex-wrap items-center gap-1">
                {displayTechnologies.map(tech => (
                  <Badge key={tech.id} variant="glossy" className="text-xs">
                    <TechnologyIcon
                      name={tech.name}
                      colored
                      className="w-3 h-3"
                    />
                    <span className="break-words">{tech.name}</span>
                  </Badge>
                ))}
                {hasMoreTechnologies && (
                  <Badge variant="glossy" className="text-xs">
                    and
                    {" "}
                    {technologies.length - 4}
                    {" "}
                    more
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="absolute bottom-2 right-2 flex items-center gap-1">
            <Avatar className="h-4 w-4">
              <AvatarImage src={user.avatar} alt={user.username} />
            </Avatar>
            <Small className="whitespace-normal break-words">
              {user.username}
            </Small>
          </div>
        </div>
      </Card>
    </Link>
  );
}
