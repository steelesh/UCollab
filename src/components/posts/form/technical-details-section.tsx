"use client";

import type { NeedType } from "@prisma/client";
import type { Control } from "react-hook-form";

import type { CreatePostInput } from "~/features/posts/post.schema";

import { Checkbox } from "~/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Section } from "~/components/ui/section";
import TechnologiesControl from "~/components/ui/technologies-control";
import { isProjectNeedType } from "~/lib/utils";

type TechnicalDetailsSectionProps = {
  control: Control<CreatePostInput>;
  isSubmitting: boolean;
  needType: NeedType;
  secondaryNeedType: NeedType | null | undefined;
  canHaveRatings: boolean;
  suggestions: string[];
  handleTechSearch: (value: string) => void;
};

export function TechnicalDetailsSection({
  control,
  isSubmitting,
  needType,
  secondaryNeedType,
  canHaveRatings,
  suggestions,
  handleTechSearch,
}: TechnicalDetailsSectionProps) {
  const isProjectPost = isProjectNeedType(needType) || (secondaryNeedType && isProjectNeedType(secondaryNeedType));

  return (
    <Section>
      <div className="space-y-8">
        {isProjectPost && (
          <>
            <FormField
              control={control}
              name="technologies"
              rules={{ required: "Please add at least one technology" }}
              render={({ field }) => (
                <FormItem className="space-y-2 md:space-y-3">
                  <div>
                    <FormLabel className="text-sm md:text-base font-medium">
                      Technologies
                      <span className="text-destructive ml-1">*</span>
                    </FormLabel>
                    <FormDescription className="text-xs md:text-sm">
                      Add the technologies used in your project
                    </FormDescription>
                  </div>
                  <FormControl>
                    <TechnologiesControl
                      field={field}
                      isSubmitting={isSubmitting}
                      suggestions={suggestions}
                      handleTechSearch={handleTechSearch}
                    />
                  </FormControl>
                  <FormMessage className="text-xs md:text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="githubRepo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm md:text-base font-medium">GitHub Repository (optional)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      placeholder="https://github.com/username/repo"
                      disabled={isSubmitting}
                      className="text-sm md:text-base"
                    />
                  </FormControl>
                  <FormMessage className="text-xs md:text-sm" />
                </FormItem>
              )}
            />
          </>
        )}
        <div className="border-t pt-4 md:pt-6 space-y-4">
          <p className="text-sm md:text-base font-medium">Permissions</p>
          <FormField
            control={control}
            name="allowRatings"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 bg-muted/50">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={!canHaveRatings}
                  />
                </FormControl>
                <div>
                  <FormLabel className={`text-sm md:text-base ${!canHaveRatings ? "text-muted-foreground" : ""}`}>
                    Allow users to rate this
                    {" "}
                    {isProjectPost ? "project" : "post"}
                    <span className="text-xs text-muted-foreground ml-1 font-normal">
                      (
                      {!canHaveRatings
                        ? "Not applicable"
                        : "Recommended"}
                      )
                    </span>
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="allowComments"
            render={({ field }) => (
              <FormItem className="flex bg-muted/50 flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div>
                  <FormLabel className="text-sm md:text-base">
                    Allow comments on this
                    {" "}
                    {isProjectPost ? "project" : "post"}
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
    </Section>
  );
}
