import type {
  Comment as PrismaComment,
  Project as PrismaProject,
  Technology as PrismaTechnology,
  ProjectType,
  User,
} from "@prisma/client";

export type Project = Pick<
  PrismaProject,
  "id" | "title" | "description" | "createdDate" | "lastModifiedDate" | "projectType" | "githubRepo" | "createdById"
>;

export type Comment = {
  id: string;
  content: string;
  createdDate: Date;
  lastModifiedDate?: Date | null;
  createdBy: {
    id: string;
    username: string;
    avatar?: string | null;
  };
  replies?: Comment[];
  parentId?: string | null;
};

export type Technology = Pick<PrismaTechnology, "id" | "name">;

export type ProjectDetails = Pick<
  PrismaProject,
  | "id"
  | "title"
  | "description"
  | "createdDate"
  | "lastModifiedDate"
  | "projectType"
  | "githubRepo"
  | "createdById"
  | "rating"
> & {
  comments: (Pick<PrismaComment, "id" | "content" | "createdDate" | "lastModifiedDate"> & {
    createdBy: Pick<User, "id" | "username" | "avatar">;
    replies?: Comment[];
    parentId?: string | null;
  })[];
  technologies: Technology[];
  createdBy: {
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
  trendingScore: number;
};

export type ExploreProject = {
  id: string;
  title: string;
  description: string;
  createdDate: Date;
  githubRepo: string | null;
  projectType: ProjectType;
  rating: number;
  technologies: {
    id: string;
    name: string;
  }[];
  createdBy: {
    username: string;
    avatar: string;
  };
  watchers: {
    id: string;
    user: {
      username: string;
      avatar: string;
    };
  }[];
  comments: { id: string }[];
  trendingScore: number;
};

export type ExplorePageData = {
  projects: ExploreProject[];
  totalPages: number;
  currentPage: number;
  limit: number;
  totalCount: number;
};
