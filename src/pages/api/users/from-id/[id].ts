import { type NextApiRequest, type NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ log: ["query", "info", "warn", "error"] });

import {auth} from "~/lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await auth();

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const { id } = req.query;
  if (Array.isArray(id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { username: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
