import { type Prisma } from "@prisma/client";

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

export type CreateCommentInput = {
  content: string;
};

export type UpdateCommentInput = {
  content: string;
};
