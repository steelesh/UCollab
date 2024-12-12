import { type UpdatePostInput, type CreatePostInput } from "~/types/post.types";
import { db } from "~/lib/db";

const postInclude = {
  createdBy: {
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
    },
  },
  comments: {
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdDate: "desc",
    },
  },
} as const;

export const PostService = {
  async getAllPosts() {
    return db.post.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdDate: "desc",
      },
    });
  },

  async getPostById(id: string) {
    return db.post.findUnique({
      where: { id },
      include: postInclude,
    });
  },

  async createPost(data: CreatePostInput, userId: string) {
    return db.post.create({
      data: {
        ...data,
        technologies: data.technologies ?? [],
        createdById: userId,
      },
      include: postInclude,
    });
  },

  async updatePost(id: string, data: UpdatePostInput) {
    return db.post.update({
      where: { id },
      data: {
        ...data,
        technologies: data.technologies ?? undefined,
      },
      include: postInclude,
    });
  },

  async deletePost(id: string) {
    return db.post.delete({
      where: { id },
    });
  },

  async verifyPostOwner(postId: string, userId: string) {
    const post = await db.post.findUnique({
      where: { id: postId },
      select: { createdById: true },
    });

    if (!post) {
      return false;
    }

    return post.createdById === userId;
  },
};
