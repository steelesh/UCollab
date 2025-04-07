import type { Post, User } from "@prisma/client";

import type { ExplorePageData, PostDetails } from "./post.types";

import { PostService } from "./post.service";

export async function getPostTitle(postId: Post["id"]) {
  return PostService.getPostTitle(postId);
}

export async function getRealTimePost(
  postId: Post["id"],
  userId: User["id"],
): Promise<PostDetails> {
  return PostService.getPostById(postId, userId);
}

export async function getPosts(
  page: number,
  limit: number,
  userId: User["id"],
  filters: {
    query?: string;
    postNeeds?: string;
    minRating?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {},
): Promise<ExplorePageData> {
  const { posts, totalCount } = await PostService.getPaginatedPosts(
    userId,
    filters,
    page,
    limit,
  );

  return {
    posts,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
    limit,
    totalCount,
    filters,
  };
}

export async function getUserPostRating(
  postId: Post["id"],
  userId: User["id"],
): Promise<number> {
  return PostService.getUserPostRating(postId, userId);
}

export async function getTrendingPosts(
  userId: User["id"],
  page = 1,
  limit = 12,
): Promise<ExplorePageData> {
  return PostService.getTrendingPosts(userId, page, limit);
}

export async function isPostBookmarked(
  postId: Post["id"],
  userId: User["id"],
): Promise<boolean> {
  return PostService.isPostBookmarked(postId, userId);
}
