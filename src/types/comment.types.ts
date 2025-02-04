import { type Prisma } from '@prisma/client';

export type CommentResponse = Prisma.CommentGetPayload<{
  include: {
    createdBy: {
      select: {
        id: true;
        username: true;
        avatar: true;
      };
    };
  };
}>;

export interface CreateCommentInput {
  content: string;
}

export interface UpdateCommentInput {
  content: string;
}
