import type { Project, ProjectType, User } from "@prisma/client";

import { formatDate } from "date-fns";
import { ArrowUpRight, Calendar, ChartNoAxesColumn, Github, MessageSquare, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { Technology } from "~/features/projects/project.types";

import { AvatarCircles } from "../magicui/avatar-circles";
import { Avatar, AvatarImage } from "./avatar";
import { Badge } from "./badge";
import { Card, CardContent, CardHeader } from "./card";
import { Large } from "./large";
import { Muted } from "./muted";
import { P } from "./p";
import { ProjectTypeBadge, TrendingBadge } from "./project-badges";
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
  trendingScore: number;
  watchers: {
    id: User["id"];
    user: {
      username: User["username"];
      avatar: User["avatar"];
    };
  }[];
  comments: number;
};

export function ProjectCard({
  id,
  title,
  description,
  createdDate,
  technologies,
  rating,
  githubRepo,
  projectType,
  user,
  trendingScore,
  watchers,
  comments,
}: ProjectCardProps) {
  const displayTechnologies = technologies.slice(0, 4);
  const hasMoreTechnologies = technologies.length > 4;
  const isTrending = trendingScore > 0.5;

  return (
    <Card variant="glossy" className="group w-full pt-0 flex flex-col">
      <div className="relative h-48 w-full overflow-hidden rounded-t-lg flex-shrink-0">
        <Image
          src="/images/banner-placeholder.png"
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardHeader className="flex flex-col gap-4 pb-4 flex-shrink-0">
        <div className="flex flex-col xs:flex-row gap-2 xs:justify-between xs:items-center">
          <Badge variant="rating" className="py-0.5 xs:py-1 px-1.5 xs:px-2 text-xs">
            <Small noMargin className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 xs:w-4 xs:h-4 fill-yellow-400 stroke-black stroke-[1.5px]" />
              {rating > 0 ? rating.toFixed(1) : "Not rated"}
            </Small>
          </Badge>
          <ProjectTypeBadge type={projectType} className="py-0.5 xs:py-1 px-1.5 xs:px-2 text-xs" />
        </div>
        <Link href={`/p/${id}`} className="group/link flex items-center gap-2">
          <Large noMargin className="truncate underline-offset-4 underline">
            {title}
          </Large>
          <ArrowUpRight className="w-5 h-5 opacity-0 translate-y-1 group-hover/link:opacity-100 group-hover/link:translate-y-0 transition-all duration-300 ease-out" />
        </Link>
        <div className="flex flex-col gap-2">
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
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="w-6 h-6 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </span>
            <Muted>
              <span>{formatDate(createdDate, "MMMM dd, yyyy")}</span>
            </Muted>
          </div>
          {githubRepo && (
            <Link href={githubRepo} className="group/github flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
              <span className="w-6 h-6 flex items-center justify-center">
                <Github className="w-4 h-4" />
              </span>
              <span>View on GitHub</span>
              <ArrowUpRight className="w-3 h-3 opacity-0 translate-y-0.5 group-hover/github:opacity-100 group-hover/github:translate-y-0 transition-all duration-200" />
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden">
        <div className="flex flex-col gap-2 mb-8">
          <P>Description:</P>
          <Muted className="line-clamp-3 overflow-ellipsis">{description}</Muted>
        </div>
        <div className="flex flex-col gap-2 mb-10">
          <P>Technologies:</P>
          <div className="flex flex-wrap gap-2">
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
        <div className="mt-auto flex flex-col gap-3 flex-shrink-0 pt-4">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
              {watchers.length > 0 && (
                <>
                  <ChartNoAxesColumn className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                  <Small noMargin className="text-xs xs:text-sm">
                    {watchers.length}
                    <span className="hidden xs:inline">
                      {" "}
                      {watchers.length === 1 ? "watcher" : "watchers"}
                    </span>
                  </Small>
                  <AvatarCircles
                    avatarUrls={watchers.map(w => ({
                      imageUrl: w.user.avatar,
                      profileUrl: `/u/${w.user.username}`,
                    }))}
                    numPeople={0}
                    className="scale-75"
                  />
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
              <Small noMargin className="text-xs xs:text-sm">
                {comments}
                <span className="hidden xs:inline">
                  {" "}
                  {comments === 1 ? "comment" : "comments"}
                </span>
              </Small>
              {isTrending && (
                <TrendingBadge className="py-0.5 xs:py-1 px-1.5 xs:px-2 ml-2 text-xs" />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
