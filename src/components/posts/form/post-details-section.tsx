"use client";

import type { NeedType } from "@prisma/client";
import type { Control } from "react-hook-form";

import type { CreatePostInput } from "~/features/posts/post.schema";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Section } from "~/components/ui/section";
import { Textarea } from "~/components/ui/textarea";

type PostDetailsSectionProps = {
  control: Control<CreatePostInput>;
  needType: NeedType;
  isSubmitting: boolean;
};

export function PostDetailsSection({
  control,
  isSubmitting,
}: PostDetailsSectionProps) {
  return (
    <Section>
      <div className="space-y-8">
        <FormField
          control={control}
          name="title"
          rules={{ required: "Post title is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Post Title
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter post title"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="description"
          rules={{ required: "Post description is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Description
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="min-h-[120px]"
                  placeholder="Describe your post"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Section>
  );
}
