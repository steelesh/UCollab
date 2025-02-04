import { withApiAuth } from "@/src/lib/auth/protected-api";
import { CommentService } from "@/src/services/comment.service";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { commentId: string } },
) {
  return withApiAuth(null, async (userId) => {
    return CommentService.getComment(params.commentId, userId);
  });
}
