"use client";

import type { User } from "@prisma/client";

import type { Technology } from "~/features/posts/post.types";

import { Badge } from "../ui/badge";
import { TechnologyIcon } from "../ui/technology-icon";
import { MENTORSHIP_CONFIG } from "./profile-mentorship-config";

type ProfileUserInfoProps = {
  readonly createdDate: User["createdDate"];
  readonly gradYear: User["gradYear"];
  readonly mentorship: User["mentorship"];
  readonly technologies: Technology[];
  readonly bio: User["bio"];
};

export function ProfileUserInfo({ createdDate, gradYear, mentorship, bio, technologies }: ProfileUserInfoProps) {
  const maxTechnologies = 4;
  const displayTechnologies = technologies.slice(0, maxTechnologies);
  const remainingCount = technologies.length - maxTechnologies;

  return (
    <div>
      <p className="text-muted-foreground text-sm">
        Joined
        {" "}
        {new Date(createdDate)
          .toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
          .replace(",", "")}
      </p>
      <p className="text-muted-foreground text-sm">
        Class of
        {" "}
        {gradYear}
      </p>
      <p className="text-muted-foreground flex items-center gap-1 text-sm">
        {MENTORSHIP_CONFIG[mentorship].icon}
        <span>{MENTORSHIP_CONFIG[mentorship].label}</span>
      </p>
      <p className="text-sm font-semibold pt-4">About me:</p>
      <p className={`text-sm whitespace-pre-wrap py-2 ${!bio || !bio.trim() ? "text-muted-foreground italic" : ""}`}>
        {bio && bio.trim() ? bio : "This user hasn't set a bio yet."}
      </p>
      <p className="text-sm font-semibold">Skills:</p>
      <div className="flex flex-wrap items-center gap-2 pt-2">
        {displayTechnologies.map(tech => (
          <Badge key={tech.id ?? tech.name} variant="glossy" className="flex items-center gap-1">
            <TechnologyIcon name={tech.name} colored />
            <span className="truncate">{tech.name}</span>
          </Badge>
        ))}
        {remainingCount > 0 && (
          <Badge variant="glossy" className="flex items-center">
            +
            {" "}
            {remainingCount}
          </Badge>
        )}
      </div>
    </div>
  );
}
