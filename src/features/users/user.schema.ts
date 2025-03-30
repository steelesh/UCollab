import { MentorshipStatus } from "@prisma/client";
import { z } from "zod";

import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "~/lib/utils";

export const userSelect = {
  id: true,
  username: true,
  email: true,
  fullName: true,
  firstName: true,
  lastName: true,
  avatar: true,
  avatarSource: true,
  onboardingStep: true,
  createdDate: true,
} as const;

export const publicUserSelect = {
  id: true,
  username: true,
  fullName: true,
  avatar: true,
  technologies: true,
} as const;

export const userSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(/^[\w.-]+$/, "Username can only contain letters, numbers, dots, hyphens and underscores"),
  email: z
    .string()
    .email("Invalid email address")
    .regex(
      /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
      "Email can only contain letters, numbers, and common special characters",
    ),
});

export const onboardingSchema = z.object({
  gradYear: z.string().regex(/^\d{4}$/, "Grad year must be a 4-digit year."),
  technologies: z.array(z.string()),
  githubProfile: z.string().url({ message: "Invalid URL" }),
  mentorshipStatus: z.enum(["MENTOR", "MENTEE", "NONE"]),
});

export const updateUserSchema = z.object({
  username: userSchema.shape.username.optional(),
  avatar: z
    .instanceof(File, { message: "Avatar must be a valid file" })
    .refine(file => file.size <= MAX_FILE_SIZE, "File size must be less than 5MB")
    .refine(
      file => Object.values(ACCEPTED_IMAGE_TYPES).includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported",
    )
    .nullable()
    .optional(),
  gradYear: z.coerce.number().optional(),
  mentorship: z.nativeEnum(MentorshipStatus).optional(),
  bio: z.string().optional(),
  notificationPreferences: z
    .object({
      allowComments: z.boolean().optional(),
      allowMentions: z.boolean().optional(),
      allowPostUpdates: z.boolean().optional(),
      allowSystem: z.boolean().optional(),
    })
    .optional(),
});

export type CreateUserInput = z.infer<typeof userSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CompleteOnboardingData = z.infer<typeof onboardingSchema>;
