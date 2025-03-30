"use client";

import type { Control } from "react-hook-form";

import { NeedType } from "@prisma/client";
import {
  Code,
  GraduationCap,
  Lightbulb,
  MessageSquare,
  UserCircle,
  Users,
} from "lucide-react";

import type { CreatePostInput } from "~/features/posts/post.schema";

import { Card, CardContent } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Muted } from "~/components/ui/muted";
import { P } from "~/components/ui/p";
import { PostTypeBadge } from "~/components/ui/post-badges";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Section } from "~/components/ui/section";

type PostTypeSectionProps = {
  control: Control<CreatePostInput>;
  isEditMode?: boolean;
  initialNeedType?: NeedType;
};

export function PostTypeSection({
  control,
  isEditMode = false,
  initialNeedType,
}: PostTypeSectionProps) {
  const renderSecondaryTypeOption = (
    primaryType: NeedType,
    field: any,
  ) => {
    let secondaryType: NeedType | null = null;
    let label = "";

    if (primaryType === NeedType.FEEDBACK) {
      secondaryType = NeedType.CONTRIBUTION;
      label = "Open to contributors";
    } else if (primaryType === NeedType.CONTRIBUTION) {
      secondaryType = NeedType.FEEDBACK;
      label = "Open to feedback";
    } else {
      return <></>;
    }

    return (
      <div className="flex items-start space-x-3">
        <FormControl>
          <Checkbox
            checked={field.value === secondaryType}
            onCheckedChange={(checked) => {
              field.onChange(checked ? secondaryType : null);
            }}
          />
        </FormControl>
        <div>
          <FormLabel className="font-normal cursor-pointer">
            {label}
          </FormLabel>
        </div>
      </div>
    );
  };

  return (
    <Section>
      <div className="space-y-6">
        {isEditMode && initialNeedType
          ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FormLabel className="text-sm md:text-base font-medium mb-0">Post Type:</FormLabel>
                    <PostTypeBadge type={initialNeedType} size="sm" />
                  </div>
                  <Muted className="block mt-1 mb-4 text-xs md:text-sm">
                    <span className="text-destructive mr-1">*</span>
                    <i>The post type cannot be changed after creation.</i>
                  </Muted>
                </div>

                {(initialNeedType === NeedType.FEEDBACK || initialNeedType === NeedType.CONTRIBUTION) && (
                  <FormField
                    control={control}
                    name="secondaryNeedType"
                    render={({ field }) => (
                      <FormItem className="border p-3 md:p-4 rounded-md bg-muted/50">
                        <FormLabel className="text-xs md:text-sm font-medium mb-2 block">Secondary Post Type (Optional)</FormLabel>
                        {renderSecondaryTypeOption(initialNeedType, field)}
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )
          : (
              <>
                <FormField
                  control={control}
                  name="needType"
                  rules={{ required: "Please select a post type" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm md:text-base font-medium">What are you looking for?</FormLabel>
                      <RadioGroup
                        className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3"
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        {[
                          {
                            value: NeedType.FEEDBACK,
                            label: "Project Feedback",
                            description: "Get fresh eyes on your project and valuable insights from the community.",
                            icon: MessageSquare,
                          },
                          {
                            value: NeedType.CONTRIBUTION,
                            label: "Project Contribution",
                            description: "Find skilled collaborators to help with coding, design, testing, or documentation.",
                            icon: Code,
                          },
                          {
                            value: NeedType.DEVELOPER_AVAILABLE,
                            label: "Developer Available",
                            description: "Signal your availability and showcase your skills to find exciting projects to join.",
                            icon: UserCircle,
                          },
                          {
                            value: NeedType.SEEKING_MENTOR,
                            label: "Seeking Mentor",
                            description: "Connect with experienced developers for guidance on your learning journey.",
                            icon: Lightbulb,
                          },
                          {
                            value: NeedType.MENTOR_AVAILABLE,
                            label: "Mentor Available",
                            description: "Share your expertise and help others grow in their development skills.",
                            icon: GraduationCap,
                          },
                          {
                            value: NeedType.TEAM_FORMATION,
                            label: "Team Formation",
                            description: "Build a team for your project idea or find a project team to join.",
                            icon: Users,
                          },
                        ].map((option) => {
                          const Icon = option.icon;
                          return (
                            <label
                              key={option.value}
                              htmlFor={`radio-${option.value}`}
                              className="block"
                              aria-label={option.label}
                            >
                              <Card
                                className={`relative cursor-pointer bg-muted/50 hover:border-primary/50 transition-colors ${field.value === option.value ? "border-primary/70" : ""}`}
                              >
                                <CardContent className="p-3 md:p-4 h-full">
                                  <FormItem className="flex items-start space-x-3 m-0">
                                    <FormControl>
                                      <RadioGroupItem
                                        id={`radio-${option.value}`}
                                        value={option.value}
                                        className="mt-1"
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none w-full">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm md:text-base font-medium">{option.label}</span>
                                        <Icon className="h-5 w-5 text-muted-foreground" />
                                      </div>
                                      <P className="text-xs md:text-sm text-muted-foreground">{option.description}</P>
                                    </div>
                                  </FormItem>

                                  {(option.value === NeedType.FEEDBACK || option.value === NeedType.CONTRIBUTION) && (
                                    <div
                                      className="ml-6 pl-3 mt-3 pt-3 border-t min-h-[40px]"
                                      onClick={e => e.stopPropagation()}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                          e.stopPropagation();
                                        }
                                      }}
                                      role="button"
                                      tabIndex={0}
                                    >
                                      {field.value === option.value && (
                                        <FormField
                                          control={control}
                                          name="secondaryNeedType"
                                          render={({ field: secondaryField }) => renderSecondaryTypeOption(option.value, secondaryField)}
                                        />
                                      )}
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            </label>
                          );
                        })}
                      </RadioGroup>
                      <FormMessage className="text-xs md:text-sm mt-2" />
                    </FormItem>
                  )}
                />
              </>
            )}
      </div>
    </Section>
  );
}
