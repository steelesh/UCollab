import type { Project, User } from "@prisma/client";

import { ProjectType } from "@prisma/client";
import { formatDate } from "date-fns";
import { ArrowUpRight, Github, GitPullRequest, MessageSquare, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { Technology } from "~/features/projects/project.types";

import { cn } from "~/lib/utils";

import { Avatar, AvatarImage } from "./avatar";
import { Badge } from "./badge";
import { Card, CardContent, CardHeader } from "./card";
import { Large } from "./large";
import { Muted } from "./muted";
import { P } from "./p";
import { Small } from "./small";
import { TechnologyIcon } from "./technology-icon";

type ProjectCardProps = {
  id: Project["id"];
  title: Project["title"];
  description: Project["description"];
  createdDate: Project["createdDate"];
  technologies: Technology[];
  rating: number;
  githubRepo: Project["githubRepo"];
  projectType: ProjectType;
  user: {
    username: User["username"];
    avatar: User["avatar"];
  };
};

export function ProjectCard({ id, title, description, createdDate, technologies, rating, githubRepo, projectType, user }: ProjectCardProps) {
  const displayTechnologies = technologies.slice(0, 4);
  const hasMoreTechnologies = technologies.length > 4;

  return (
    <Card variant="glossy" className="group w-full h-[600px] pt-0">
      <div className="relative h-100 w-full overflow-hidden rounded-t-lg">
        <Image
          src="/images/banner-placeholder.png"
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 z-10">
          <Badge
            variant="glossy"
            className={cn(
              "text-white p-2",
              projectType === ProjectType.CONTRIBUTION && "text-green-400",
              projectType === ProjectType.FEEDBACK && "text-blue-400",
            )}
          >
            {projectType === ProjectType.CONTRIBUTION && (
              <Small noMargin className="flex items-center gap-1">
                <GitPullRequest className="w-3 h-3" />
                {" "}
                Seeking Contributors
              </Small>
            )}
            {projectType === ProjectType.FEEDBACK && (
              <Small noMargin className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                {" "}
                Wanting Feedback
              </Small>
            )}
          </Badge>
        </div>
      </div>
      <CardHeader className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <Muted>
            <Small noMargin className="font-light">
              {formatDate(createdDate, "MM/dd/yyyy")}
            </Small>
          </Muted>
          <Link href={`/p/${id}`} className="group/link flex items-center gap-2">
            <Large noMargin className="truncate underline-offset-4 underline">
              {title}
            </Large>
            <ArrowUpRight className="w-5 h-5 opacity-0 translate-y-1 group-hover/link:opacity-100 group-hover/link:translate-y-0 transition-all duration-300 ease-out" />
          </Link>
        </div>
        <div className="flex items-center">
          <div className="flex flex-col gap-2">
            <Link
              href={`/u/${user.username}`}
              className="group/user flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors duration-200"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={user.avatar} alt={user.username} />
              </Avatar>
              <span>{user.username}</span>
              <ArrowUpRight className="w-3 h-3 opacity-0 translate-y-0.5 group-hover/user:opacity-100 group-hover/user:translate-y-0 transition-all duration-200" />
            </Link>
            <div className="flex items-center gap-2">
              <Star className={`w-6 h-6 text-yellow-400 ${rating > 0 ? "fill-yellow-400" : ""}`} />
              <Muted>
                <Small noMargin>
                  {rating > 0 ? rating.toFixed(1) : "No ratings yet"}
                </Small>
              </Muted>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-10">
          <div className="flex flex-wrap items-center gap-2">
            <P>Description:</P>
            <Muted>{description}</Muted>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <P>Technologies:</P>
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
        </div>
        {githubRepo && (
          <Link href={githubRepo} className="absolute bottom-0 right-4 text-muted-foreground hover:text-white transition-colors duration-200">
            <Small noMargin className="flex items-center gap-1">
              View on
              <Github className="w-4 h-4" />
            </Small>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
