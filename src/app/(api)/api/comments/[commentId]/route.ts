import { withApiAuth } from "@/src/lib/auth/protected-api";
import { Permission } from "@/src/lib/permissions";
import { CommentService } from "@/src/services/comment.service";
import { NextRequest } from "next/server";

// Get a single comment
export async function GET(
  req: NextRequest,
  { params }: { params: { commentId: string } },
) {
  return withApiAuth(req, Permission.VIEW_POSTS, async (userId) => {
    return CommentService.getComment(params.commentId, userId);
  });
}
