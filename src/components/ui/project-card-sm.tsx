import type { Project, ProjectType, User } from "@prisma/client";

import { formatDate } from "date-fns";
import { ArrowUpRight, Calendar, Star } from "lucide-react";
import Link from "next/link";

import type { Technology } from "~/features/projects/project.types";

import { Avatar, AvatarImage } from "./avatar";
import { Badge } from "./badge";
import { Card, CardContent, CardHeader } from "./card";
import { Large } from "./large";
import { ProjectTypeBadge } from "./project-badges";
import { Small } from "./small";
import { TechnologyIcon } from "./technology-icon";

type ProjectCardSmallProps = {
  id: Project["id"];
  title: Project["title"];
  createdDate: Project["createdDate"];
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
  rating: number;
};

export function ProjectCardSmall({
  id,
  title,
  createdDate,
  technologies,
  projectType,
  user,
  rating,
}: ProjectCardSmallProps) {
  const displayTechnologies = technologies.slice(0, 4);
  const hasMoreTechnologies = technologies.length > 4;

  return (
    <Card variant="glossy" className="group w-full min-h-[200px] pt-0">
      <CardHeader className="flex flex-row items-start gap-4 p-6">
        <Avatar className="h-18 w-18">
          <AvatarImage src="/images/banner-placeholder.png" alt={title} />
        </Avatar>
        <div className="flex flex-col gap-1 flex-1">
          <Link
            href={`/p/${id}`}
            className="group/link flex items-center gap-2 min-w-0"
          >
            <Large noMargin className="truncate underline-offset-4 underline">
              {title}
            </Large>
            <ArrowUpRight className="w-4 h-4 opacity-0 translate-y-1 group-hover/link:opacity-100 group-hover/link:translate-y-0 transition-all duration-300 ease-out" />
          </Link>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <Small noMargin>{formatDate(createdDate, "MMMM dd, yyyy")}</Small>
          </div>
          <div>
            <ProjectTypeBadge type={projectType} className="py-1 px-2" />
          </div>
          <div>
            <Badge variant="rating" className="px-2 inline-block">
              <Small noMargin className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 stroke-black stroke-[1.5px]" />
                {rating > 0 ? rating.toFixed(1) : "Not yet rated"}
              </Small>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {displayTechnologies.map(tech => (
            <Badge key={tech.id} variant="glossy">
              <TechnologyIcon name={tech.name} colored />
              <span className="truncate">{tech.name}</span>
            </Badge>
          ))}
          {hasMoreTechnologies && (
            <Badge variant="glossy">
              and
              {" "}
              {technologies.length - 4}
              {" "}
              more
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/u/${user.username}`}
            className="group/user flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={user.avatar} alt={user.username} />
            </Avatar>
            <span>{user.username}</span>
            <ArrowUpRight className="w-3 h-3 opacity-0 translate-y-0.5 group-hover/user:opacity-100 group-hover/user:translate-y-0 transition-all duration-200" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
