import type { Post, User } from "@prisma/client";

import type { ExplorePageData, ExplorePost, PostDetails } from "./post.types";

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

export async function getAllPosts(
  page: number,
  limit: number,
  userId: User["id"],
  filters: {
    query?: string;
    minRating?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {},
): Promise<ExplorePageData> {
  const { posts, totalCount } = await PostService.getAllPosts(
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

export async function getFeedbackPosts(
  page: number,
  limit: number,
  userId: User["id"],
  filters: {
    query?: string;
    minRating?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {},
): Promise<ExplorePageData> {
  const { posts, totalCount } = await PostService.getAllPosts(userId, filters, page, limit);

  return {
    posts,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
    limit,
    totalCount,
    filters,
  };
}

export async function getCollaborationPosts(
  page: number,
  limit: number,
  userId: User["id"],
  filters: {
    query?: string;
    minRating?: string;
    sortBy?: string;
    sortOrder?: string;
    postNeeds?: string;
  } = {},
): Promise<ExplorePageData> {
  const { postNeeds = "CONTRIBUTION", ...otherFilters } = filters;

  const allPostsFilters = {
    ...otherFilters,
    needType: postNeeds,
  };

  const { posts, totalCount } = await PostService.getAllPosts(userId, allPostsFilters, page, limit);

  return {
    posts,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
    limit,
    totalCount,
    filters,
  };
}

export async function getMentorshipPosts(
  page: number,
  limit: number,
  userId: User["id"],
  filters: {
    query?: string;
    sortBy?: string;
    sortOrder?: string;
    postNeeds?: string;
  } = {},
): Promise<ExplorePageData> {
  const { postNeeds = "MENTOR_AVAILABLE", ...otherFilters } = filters;

  const allPostsFilters = {
    ...otherFilters,
    needType: postNeeds,
  };

  const { posts, totalCount } = await PostService.getAllPosts(userId, allPostsFilters, page, limit);

  return {
    posts,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
    limit,
    totalCount,
    filters,
  };
}

export async function getTeamFormationPosts(
  page: number,
  limit: number,
  userId: User["id"],
  filters: {
    query?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {},
): Promise<ExplorePageData> {
  const { posts, totalCount } = await PostService.getAllPosts(userId, filters, page, limit);

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
  filters: {
    query?: string;
    minRating?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {},
): Promise<ExplorePageData> {
  const result = await PostService.getTrendingPosts(userId, filters, page, limit);

  return {
    posts: result.posts,
    totalPages: result.totalPages,
    currentPage: result.currentPage,
    limit: result.limit,
    totalCount: result.totalCount,
    filters,
  };
}

export async function isPostBookmarked(
  postId: Post["id"],
  userId: User["id"],
): Promise<boolean> {
  return PostService.isPostBookmarked(postId, userId);
}

export async function getTopTrendingPosts(
  userId: User["id"],
  limit = 6,
): Promise<ExplorePost[]> {
  const result = await getTrendingPosts(userId, 1, limit, {});
  return result.posts;
}
