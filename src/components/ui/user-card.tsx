import type { User } from "@prisma/client";

import { MentorshipStatus } from "@prisma/client";
import { ArrowUpRight, GraduationCap, Mail, UserCog } from "lucide-react";
import Link from "next/link";

import type { Technology } from "~/features/users/user.types";

import { cn } from "~/lib/utils";

import { Avatar, AvatarImage } from "./avatar";
import { Badge } from "./badge";
import { Card, CardContent, CardHeader } from "./card";
import { Large } from "./large";
import { Muted } from "./muted";
import { Small } from "./small";
import { TechnologyIcon } from "./technology-icon";

type UserCardProps = {
  username: User["username"];
  avatar: User["avatar"];
  firstName: User["firstName"];
  lastName: User["lastName"];
  email: User["email"];
  gradYear: User["gradYear"];
  technologies: Technology[];
  mentorship: User["mentorship"];
};

export function UserCard({ username, firstName, lastName, avatar, email, gradYear, technologies, mentorship }: UserCardProps) {
  const displayTechnologies = technologies.slice(0, 4);
  const hasMoreTechnologies = technologies.length > 4;

  return (
    <Card variant="glossy" className="group w-full h-[200px]">
      <CardHeader className="flex flex-row items-start gap-4">
        <Avatar className="h-18 w-18">
          <AvatarImage src={avatar} alt={username} />
        </Avatar>
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/u/${username}`}
              className="group/link flex items-center gap-2 min-w-0"
            >
              <Large noMargin className="truncate">
                {firstName}
                {" "}
                {lastName}
              </Large>
              <Muted>
                <Small>
                  (
                  {username}
                  )
                </Small>
              </Muted>
              <ArrowUpRight className="w-4 h-4 opacity-0 translate-y-1 group-hover/link:opacity-100 group-hover/link:translate-y-0 transition-all duration-300 ease-out" />
            </Link>
          </div>
          <Muted className="flex items-center gap-1 truncate">
            <Mail className="w-4 h-4" />
            <Small noMargin className="truncate">{email}</Small>
          </Muted>
          <Muted className="flex items-center gap-1">
            <GraduationCap className="w-4 h-4" />
            <Small noMargin>
              Class of
              {" "}
              {gradYear}
            </Small>
          </Muted>
        </div>
        <Badge
          variant="glossy"
          className={cn(
            "absolute top-1 right-1 flex items-center gap-1 text-xs",
            mentorship === MentorshipStatus.MENTOR && "bg-blue-500/20 text-blue-400",
            mentorship === MentorshipStatus.MENTEE && "bg-purple-500/20 text-purple-400",
            mentorship === MentorshipStatus.NONE && "bg-neutral-500/20 text-neutral-400",
          )}
        >
          {mentorship === MentorshipStatus.MENTOR && (
            <Small noMargin className="flex items-center gap-1">
              <UserCog className="w-3 h-3" />
              {" "}
              Mentor
            </Small>
          )}
          {mentorship === MentorshipStatus.MENTEE && (
            <Small noMargin className="flex items-center gap-1">
              <GraduationCap className="w-3 h-3" />
              {" "}
              Mentee
            </Small>
          )}
          {mentorship === MentorshipStatus.NONE && <Small noMargin>N/A</Small>}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-2">
          <Muted>
            <Small noMargin>Skills:</Small>
          </Muted>
          {displayTechnologies.map(tech => (
            <Badge key={tech.id} variant="glossy" className="flex items-center gap-1 group-hover:text-white/90">
              <TechnologyIcon name={tech.name} colored />
              <span className="truncate">{tech.name}</span>

            </Badge>
          ))}
          {hasMoreTechnologies && (
            <Badge variant="glossy" className="group-hover:text-white/90">
              and
              {" "}
              {technologies.length - 4}
              {" "}
              more
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
