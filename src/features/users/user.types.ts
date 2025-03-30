import type { Post, Comment as PrismaComment, User } from "@prisma/client";

export type Comment = {
  post: {
    title: string;
  };
} & Pick<PrismaComment, "id" | "content" | "postId" | "createdDate">;

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
  posts: Post[];
  comments: Comment[];
};

export type MinimalUserForDirectory = {
  id: User["id"];
  avatar: User["avatar"];
  firstName: User["firstName"];
  lastName: User["lastName"];
  username: User["username"];
  email: User["email"];
  gradYear: User["gradYear"];
  technologies: Technology[];
  mentorship: User["mentorship"];
};
