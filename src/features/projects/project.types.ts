import {
  Project as PrismaProject,
  Comment as PrismaComment,
  Technology as PrismaTechnology,
  User,
} from '@prisma/client';

export type Project = Pick<
  PrismaProject,
  'id' | 'title' | 'description' | 'createdDate' | 'lastModifiedDate' | 'projectType' | 'githubRepo' | 'createdById'
>;

export interface Comment {
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
}

export type Technology = Pick<PrismaTechnology, 'id' | 'name'>;

export type ProjectDetails = Pick<
  PrismaProject,
  | 'id'
  | 'title'
  | 'description'
  | 'createdDate'
  | 'lastModifiedDate'
  | 'projectType'
  | 'githubRepo'
  | 'createdById'
  | 'rating'
> & {
  comments: (Pick<PrismaComment, 'id' | 'content' | 'createdDate' | 'lastModifiedDate'> & {
    createdBy: Pick<User, 'id' | 'username' | 'avatar'>;
    replies?: Comment[];
    parentId?: string | null;
  })[];
  technologies: Technology[];
};

export type ExploreProject = Pick<
  PrismaProject,
  'id' | 'title' | 'description' | 'createdDate' | 'projectType' | 'githubRepo' | 'rating'
> & {
  technologies: Technology[];
};

export interface ExplorePageData {
  projects: ExploreProject[];
  totalPages: number;
  currentPage: number;
  limit: number;
  totalCount: number;
}
