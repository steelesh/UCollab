import { NeedType } from "@prisma/client";
import { z } from "zod";

import { isProjectNeedType } from "~/lib/utils";

export const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required").max(1000),
  needType: z.nativeEnum(NeedType, { errorMap: () => ({ message: "Invalid primary need type" }) }),
  secondaryNeedType: z.preprocess(
    val => (val === "" ? null : val),
    z.nativeEnum(NeedType, { errorMap: () => ({ message: "Invalid secondary need type" }) }).optional().nullable(),
  ),
  technologies: z.preprocess((val) => {
    if (typeof val === "string") {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) {
          return parsed.filter(item => typeof item === "string");
        }
      } catch {
        return [];
      }
    }
    return val ?? [];
  }, z.array(z.string()).optional().default([])),
  githubRepo: z.preprocess(
    val => (val === "" ? null : val),
    z.string().url("Invalid GitHub URL").optional().nullable(),
  ),
  allowRatings: z.preprocess(
    val => typeof val === "string" ? val === "true" : Boolean(val),
    z.boolean(),
  ),
  allowComments: z.preprocess(
    val => typeof val === "string" ? val === "true" : val !== undefined ? Boolean(val) : true,
    z.boolean(),
  ),
}).superRefine((data, ctx) => {
  const isPrimaryProject = isProjectNeedType(data.needType);

  const isSecondaryProject = isProjectNeedType(data.secondaryNeedType);
  if ((isPrimaryProject || isSecondaryProject) && (!data.technologies || data.technologies.length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "At least one technology is required for project posts (Feedback/Contribution)",
      path: ["technologies"],
    });
  }

  if (data.secondaryNeedType) {
    if (!isPrimaryProject) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Only Feedback or Contribution posts can have a secondary need type.",
        path: ["secondaryNeedType"],
      });
    } else {
      const validCombination
        = (data.needType === NeedType.FEEDBACK && data.secondaryNeedType === NeedType.CONTRIBUTION)
          || (data.needType === NeedType.CONTRIBUTION && data.secondaryNeedType === NeedType.FEEDBACK);

      if (!validCombination) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Secondary need type must be the other project type (Feedback/Contribution)",
          path: ["secondaryNeedType"],
        });
      }
    }
  }
});

export const postRatingSchema = z.object({
  postId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
});

export type CreatePostInput = z.infer<typeof postSchema>;
