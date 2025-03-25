import { z } from 'zod';

export const mentorshipGraphSchema = z.object({
  // For now, no input parameters are needed.
  // Add parameters here if you later want to filter or modify the request.
});

export type MentorshipGraphInput = z.infer<typeof mentorshipGraphSchema>;
