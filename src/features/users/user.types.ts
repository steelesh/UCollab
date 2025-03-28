import type { Comment as PrismaComment, Project, User } from "@prisma/client";

export type Comment = {
  project: {
    title: string;
  };
} & Pick<PrismaComment, "id" | "content" | "projectId" | "createdDate">;

export type Technology = {
  id: string;
  name: string;
  createdDate: Date;
  verified: boolean;
};

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

export type MinimalUserForDirectory = {
  id: User["id"];
  avatar: User["avatar"];
  firstName: User["firstName"];
  lastName: User["lastName"];
  username: User["username"];
  technologies: Technology[];
};
