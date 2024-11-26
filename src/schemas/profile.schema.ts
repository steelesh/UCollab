import { z } from "zod";

export const profileSchema = z.object({
  bio: z.string().max(500).optional(),
  skills: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  gradYear: z.number().min(2000).max(2100).optional(),
});
