import type {
  NeedType,
  Comment as PrismaComment,
  Post as PrismaPost,
  Technology as PrismaTechnology,
  User,
} from "@prisma/client";

export type Post = Pick<
  PrismaPost,
  "id" | "title" | "description" | "createdDate" | "lastModifiedDate" | "githubRepo" | "createdById" | "allowRatings" | "allowComments" | "bannerImage"
> & {
  postNeeds: PostNeed[];
};

export type PostNeed = {
  id: string;
  needType: NeedType;
  isPrimary: boolean;
};

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

export type PostDetails = Pick<
  PrismaPost,
  | "id"
  | "title"
  | "description"
  | "createdDate"
  | "lastModifiedDate"
  | "githubRepo"
  | "createdById"
  | "rating"
  | "allowRatings"
  | "allowComments"
  | "bannerImage"
> & {
  postNeeds: PostNeed[];
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

export type ExplorePost = {
  id: string;
  title: string;
  description: string;
  createdDate: Date;
  githubRepo: string | null;
  bannerImage: string | null;
  postNeeds: PostNeed[];
  rating: number;
  allowRatings: boolean;
  allowComments: boolean;
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
  posts: ExplorePost[];
  totalPages: number;
  currentPage: number;
  limit: number;
  totalCount: number;
};
