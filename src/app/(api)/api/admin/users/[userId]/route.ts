import { withApiAuth } from "@/src/lib/auth/protected-api";
import { Permission } from "@/src/lib/permissions";
import { UserService } from "@/src/services/user.service";
import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { userId: string } },
) {
  return withApiAuth(_req, Permission.VIEW_USERS, async (requestUserId) => {
    return UserService.getAdminUserDetails(params.userId, requestUserId);
  });
}
