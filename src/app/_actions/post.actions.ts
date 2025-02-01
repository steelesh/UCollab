import { auth } from "@/auth";
import { ErrorMessage } from "@/src/lib/constants";
import { CreatePostInput, UpdatePostInput } from "@/src/schemas/post.schema";
import { PostService } from "@/src/services/post.service";
import { Post } from "@prisma/client";

export async function createPost(data: CreatePostInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  return PostService.createPost(
    { ...data, userId: session.user.id },
    session.user.id,
  );
}

export async function updatePost(data: UpdatePostInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  return PostService.updatePost(data, session.user.id);
}

export async function deletePost(postId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  return PostService.deletePost(postId, session.user.id);
}

export async function updatePostStatus(postId: string, status: Post["status"]) {
  const session = await auth();
  if (!session?.user?.id) throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  return PostService.updatePostStatus(postId, status, session.user.id);
}
