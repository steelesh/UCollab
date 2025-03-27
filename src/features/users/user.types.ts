import type { Comment as PrismaComment, Technology as PrismaTechnology, Project, User } from "@prisma/client";

export type Comment = {
  project: {
    title: string;
  };
} & Pick<PrismaComment, "id" | "content" | "projectId" | "createdDate">;

export type Technology = Pick<PrismaTechnology, "id" | "name">;

export type UserProfile = {
  id: User["id"];
  avatar: User["avatar"];
  username: User["username"];
  email: User["email"];
  fullName: User["fullName"];
  createdDate: User["createdDate"];
  lastLogin: User["lastLogin"];
  gradYear: User["gradYear"];
  bio: User["bio"];
  mentorship: User["mentorship"];
  technologies: Technology[];
  projects: Project[];
  comments: Comment[];
};
