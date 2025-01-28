import { z } from "zod";
import { NotificationType, Prisma, User } from "@prisma/client";

export const notificationSchema = z.object({
  type: z.nativeEnum(NotificationType),
  message: z
    .string()
    .min(1, "Message is required")
    .max(500, "Message must be less than 500 characters"),
  postId: z.string().uuid("Invalid post ID").optional(),
  commentId: z.string().uuid("Invalid comment ID").optional(),
  triggeredById: z.string().uuid("Invalid user ID").optional(),
});

export const updateNotificationSchema =
  notificationSchema.partial() satisfies z.ZodType<
    Partial<Prisma.NotificationUpdateInput>
  >;

export const notificationPreferencesSchema = z.object({
  enabled: z.boolean().default(true),
  allowComments: z.boolean().default(true),
  allowMentions: z.boolean().default(true),
  allowPostUpdates: z.boolean().default(true),
  allowSystem: z.boolean().default(true),
}) satisfies z.ZodType<Partial<Prisma.NotificationPreferencesCreateInput>>;

export const updateNotificationPreferencesSchema =
  notificationPreferencesSchema.partial() satisfies z.ZodType<
    Partial<Prisma.NotificationPreferencesUpdateInput>
  >;

export type CreateNotificationInput = z.infer<typeof notificationSchema> & {
  userId: User["id"];
};

export type CreateBatchNotificationInput = z.infer<
  typeof notificationSchema
> & {
  userIds: User["id"][];
};

export type UpdateNotificationPreferencesInput = z.input<
  typeof updateNotificationPreferencesSchema
> & {
  userId: User["id"];
};

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export type PaginationParams = z.infer<typeof paginationSchema>;
