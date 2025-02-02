import { z } from 'zod';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '~/lib/constants';

export const userSelect = {
  id: true,
  username: true,
  email: true,
  fullName: true,
  firstName: true,
  lastName: true,
  avatar: true,
  avatarSource: true,
  role: true,
  onboardingStep: true,
  createdDate: true,
} as const;

export const publicUserSelect = {
  id: true,
  username: true,
  fullName: true,
  avatar: true,
} as const;

export const userSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-zA-Z0-9._-]+$/, 'Username can only contain letters, numbers, dots, hyphens and underscores'),
  email: z
    .string()
    .email('Invalid email address')
    .regex(
      /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
      'Email can only contain letters, numbers, and common special characters',
    ),
});

export const updateUserSchema = z.object({
  username: userSchema.shape.username.optional(),
  avatar: z
    .instanceof(File, { message: 'Avatar must be a valid file' })
    .refine((file) => file.size <= MAX_FILE_SIZE, 'File size must be less than 5MB')
    .refine(
      (file) => Object.values(ACCEPTED_IMAGE_TYPES).includes(file.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported',
    )
    .nullable()
    .optional(),
});

export type CreateUserInput = z.infer<typeof userSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
