"use server";

import type { Post, Prisma } from "@prisma/client";

import { redirect } from "next/navigation";

import { prisma } from "~/lib/prisma";
import { ErrorMessage, handleServerActionError } from "~/lib/utils";
import { auth } from "~/security/auth";

import { postRatingSchema, postSchema } from "./post.schema";
import { PostService } from "./post.service";

export async function createPost(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id)
    throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  try {
    const validatedData = postSchema.parse(Object.fromEntries(formData));
    const post = await PostService.createPost(validatedData, session.user.id);
    redirect(`/p/${post.id}`);
  } catch (error) {
    handleServerActionError(error);
  }
}

export async function deletePost(postId: Post["id"]) {
  const session = await auth();
  if (!session?.user?.id)
    throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  try {
    await PostService.deletePost(postId, session.user.id);
    redirect("/");
  } catch (error) {
    handleServerActionError(error);
  }
}

export async function updatePost(postId: Post["id"], formData: FormData) {
  const session = await auth();
  if (!session?.user?.id)
    throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  try {
    const validatedData = postSchema.parse(Object.fromEntries(formData));
    await PostService.updatePost(postId, validatedData, session.user.id);
    redirect(`/p/${postId}`);
  } catch (error) {
    handleServerActionError(error);
  }
}

export async function searchTechnologies(query: string) {
  const session = await auth();
  if (!session?.user?.id)
    throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  try {
    const technologies = await PostService.searchTechnologies(query, session.user.id);
    return technologies.map(t => t.name);
  } catch (error) {
    handleServerActionError(error);
  }
}

export async function ratePost(postId: Post["id"], rating: number) {
  const session = await auth();
  if (!session?.user?.id)
    throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  try {
    const validatedData = postRatingSchema.parse({ postId, rating });

    await PostService.ratePost(validatedData.postId, validatedData.rating, session.user.id);

    return { success: true };
  } catch (error) {
    return handleServerActionError(error);
  }
}

export async function getBookmarkedPosts() {
  const session = await auth();
  if (!session?.user?.id)
    throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  try {
    const bookmarkedPosts = await PostService.getUserWatchedPosts(session.user.id, session.user.id);
    const filteredPosts = bookmarkedPosts.filter(
      post => post.createdBy.username !== session.user.username,
    );
    return { success: true, posts: filteredPosts };
  } catch (error) {
    return handleServerActionError(error);
  }
}

export async function bookmarkPost(postId: Post["id"]) {
  const session = await auth();
  if (!session?.user?.id)
    throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  try {
    await PostService.watchPost(postId, session.user.id);
    return { success: true };
  } catch (error) {
    return handleServerActionError(error);
  }
}

export async function unbookmarkPost(postId: Post["id"]) {
  const session = await auth();
  if (!session?.user?.id)
    throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  try {
    await PostService.unwatchPost(postId, session.user.id);
    return { success: true };
  } catch (error) {
    return handleServerActionError(error);
  }
}

export async function getCreatedPosts() {
  const session = await auth();
  if (!session?.user?.id) {
    console.error(ErrorMessage.AUTHENTICATION_REQUIRED);
    return { success: false, posts: [] };
  }

  try {
    const createdPosts = await PostService.getPostsByUser(session.user.id, session.user.id);
    return { success: true, posts: createdPosts };
  } catch (error) {
    console.error("Failed to get created posts:", error);
    return { success: false, posts: [] };
  }
}

export async function checkPostsCount(filters: { query?: string; needType?: string; minRating?: string }) {
  const session = await auth();
  if (!session?.user?.id)
    throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  try {
    const { query = "", needType = "", minRating = "" } = filters;
    const where: Prisma.PostWhereInput = {};

    if (query) {
      where.OR = [{ title: { search: query } }, { description: { search: query } }];
    }

    if (needType) {
      where.postNeeds = {
        some: {
          needType: needType as any,
        },
      };
    }

    if (minRating) {
      where.rating = { gte: Number(minRating) };
    }

    const totalCount = await prisma.post.count({ where });
    return { success: true, totalCount };
  } catch (error) {
    return handleServerActionError(error);
  }
}

export async function deleteRating(postId: Post["id"]) {
  const session = await auth();
  if (!session?.user?.id)
    throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  try {
    await PostService.deleteRating(postId, session.user.id);
    return { success: true };
  } catch (error) {
    return handleServerActionError(error);
  }
}

export async function getTrendingPosts(_userId: string) {
  const session = await auth();
  if (!session?.user?.id)
    throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  try {
    const result = await PostService.getTrendingPosts(session.user.id);
    return { success: true, posts: result.posts };
  } catch (error) {
    return handleServerActionError(error);
  }
}
