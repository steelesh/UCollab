import { type NextApiRequest, type NextApiResponse } from "next";
import { getServerAuthSession } from "~/server/auth";
import { CommentService } from "~/services/comment.service";
import { commentSchema } from "~/schemas/comment.schema";
import { z } from "zod";
import { type ApiResponse } from "~/types/api.types";
import { type CommentResponse } from "~/types/comment.types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<CommentResponse>>
) {

  // auth check
  const session = await getServerAuthSession({ req, res });
  const userId = session?.user?.id;
  if (!userId) {
    return res.status(401).json({ data: null, error: "Unauthorized" });
  }

  // extract comment id from url
  const { id } = req.query;
  if (typeof id !== "string") {
    return res.status(400).json({ data: null, error: "Invalid comment ID" });
  }

  // handle PUT req
  switch (req.method) {
    case "PUT":
      try {
        const isOwner = await CommentService.verifyCommentOwner(id, userId);
        if (!isOwner) {
          return res.status(403).json({ data: null, error: "Forbidden" });
        }

        const validatedData = commentSchema.parse(req.body);
        const comment = await CommentService.updateComment(id, validatedData);
        return res.status(200).json({ data: comment, error: null });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ data: null, error: error });
        }
        console.error("Error updating comment:", error);
        return res.status(500).json({
          data: null,
          error: "Failed to update comment",
        });
      }

    // handle DELETE req
    case "DELETE":
      try {
        const isOwner = await CommentService.verifyCommentOwner(id, userId);
        if (!isOwner) {
          return res.status(403).json({ data: null, error: "Forbidden" });
        }

        await CommentService.deleteComment(id);
        return res.status(204).end();
      } catch (error) {
        console.error("Error deleting comment:", error);
        return res.status(500).json({
          data: null,
          error: "Failed to delete comment",
        });
      }

    // only allow GET and PUT requests
    default:
      res.setHeader("Allow", ["PUT", "DELETE"]);
      return res.status(405).json({
        data: null,
        error: `Method ${req.method} Not Allowed`,
      });
  }
}
