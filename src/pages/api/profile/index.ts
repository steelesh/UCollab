import { type NextApiRequest, type NextApiResponse } from "next";
import { getServerAuthSession } from "~/config/auth";
import { ProfileService } from "~/services/profile.service";
import { profileSchema } from "~/schemas/profile.schema";
import { z } from "zod";
import { type ApiResponse } from "~/types/api.types";
import { type PrivateProfileResponse } from "~/types/profile.types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<PrivateProfileResponse>>
) {

  // auth check
  const session = await getServerAuthSession({ req, res });
  const userId = session?.user?.id;
  if (!userId) {
    return res.status(401).json({ data: null, error: "Unauthorized" });
  }

  // handle GET req
  switch (req.method) {
    case "GET":
      try {
        const profile = await ProfileService.getPrivateProfile(userId);
        if (!profile) {
          return res.status(404).json({ data: null, error: "Profile not found" });
        }
        return res.status(200).json({ data: profile, error: null });
      } catch {
        return res.status(500).json({
          data: null,
          error: "Failed to fetch profile",
        });
      }

    // handle PUT req
    case "PUT":
      try {
        const validatedData = profileSchema.parse(req.body);
        const profile = await ProfileService.updateProfile(userId, validatedData);
        return res.status(200).json({ data: profile, error: null });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return res.status(400).json({ data: null, error: error });
        }
        console.error("Error updating profile:", error);
        return res.status(500).json({
          data: null,
          error: "Failed to update profile",
        });
      }

    // only allow GET and PUT requests
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      return res.status(405).json({
        data: null,
        error: `Method ${req.method} Not Allowed`,
      });
  }
}
