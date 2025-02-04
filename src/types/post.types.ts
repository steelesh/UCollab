import { type Prisma } from '@prisma/client';

export type PostResponse = Prisma.PostGetPayload<{
  include: {
    createdBy: {
      select: {
        id: true;
        username: true;
        avatar: true;
      };
    };
    _count: {
      select: {
        comments: true;
      };
    };
  };
}>;

export type PostWithCommentsResponse = Prisma.PostGetPayload<{
  include: {
    createdBy: {
      select: {
        id: true;
        username: true;
        avatar: true;
      };
    };
    comments: {
      include: {
        createdBy: {
          select: {
            id: true;
            username: true;
            avatar: true;
          };
        };
      };
    };
  };
}>;

export interface CreatePostInput {
  id: string;
  title: string;
  description: string;
  postType: 'CONTRIBUTION' | 'FEEDBACK' | 'DISCUSSION';
  technologies?: string[];
  githubRepo?: string;
  status: 'OPEN' | 'CLOSED';
}

export type UpdatePostInput = Partial<CreatePostInput>;
