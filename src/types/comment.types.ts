import { type Prisma } from "@prisma/client";

export type CommentResponse = Prisma.CommentGetPayload<{
  include: {
    createdBy: {
      select: {
        id: true;
        name: true;
        username: true;
        image: true;
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
