"use server";

import { ErrorMessage, handleServerActionError } from "~/lib/utils";
import { auth } from "~/security/auth";

import { MentorshipService } from "./mentorship.service";

export async function getMentorshipGraphData() {
  const session = await auth();
  if (!session?.user?.id)
    throw new Error(ErrorMessage.AUTHENTICATION_REQUIRED);

  try {
    const graphData = await MentorshipService.getMentorshipGraphData(session.user.id);
    return { success: true, graphData };
  } catch (error) {
    return handleServerActionError(error);
  }
}
