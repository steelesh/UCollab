import { z } from 'zod';

export const onboardingSchema = z.object({
  gradYear: z.string().regex(/^\d{4}$/, 'Grad year must be a 4-digit year.'),
  skills: z.string().optional(),
  githubProfile: z.string().url({ message: 'Invalid URL' }).optional(),
  postType: z.string().optional(),
});

export type CompleteOnboardingData = z.infer<typeof onboardingSchema>;
