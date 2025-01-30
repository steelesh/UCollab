import { withApiAuth } from "@/src/lib/auth/protected-api";
import { Permission } from "@/src/lib/permissions";
import { PostService } from "@/src/services/post.service";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { postId: string } },
) {
  return withApiAuth(req, Permission.VIEW_POSTS, async (userId) => {
    return PostService.getPostById(params.postId, userId);
  });
}
