import { NotificationType, User } from '@prisma/client';
import { z } from 'zod';

// Form validation schema (what users input)
export const notificationPreferencesFormSchema = z.object({
  enabled: z.boolean().default(true),
  allowComments: z.boolean().default(true),
  allowMentions: z.boolean().default(true),
  allowPostUpdates: z.boolean().default(true),
  allowSystem: z.boolean().default(true),
});

// Service input types (internal use)
export interface CreateNotificationData {
  userId: User['id'];
  type: NotificationType;
  message: string;
  postId?: string;
  commentId?: string;
  triggeredById?: string;
}

export type CreateBatchNotificationData = Omit<
  CreateNotificationData,
  'userId'
> & {
  userIds: User['id'][];
};

export interface UpdateNotificationPreferencesData {
  userId: User['id'];
  enabled?: boolean;
  allowComments?: boolean;
  allowMentions?: boolean;
  allowPostUpdates?: boolean;
  allowSystem?: boolean;
}

// Pagination params
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

// Add admin notification schemas
export const createSystemNotificationSchema = z.object({
  message: z
    .string()
    .min(1, 'Message is required')
    .max(500, 'Message must be less than 500 characters'),
  userIds: z.array(z.string()).min(1, 'At least one user must be selected'),
  type: z.nativeEnum(NotificationType).default(NotificationType.SYSTEM),
});

// Export types
export type CreateSystemNotificationInput = z.infer<
  typeof createSystemNotificationSchema
>;
