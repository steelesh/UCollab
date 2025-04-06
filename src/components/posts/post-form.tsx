"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { NeedType } from "@prisma/client";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import type { CreatePostInput } from "~/features/posts/post.schema";

import { PostDetailsSection } from "~/components/posts/form/post-details-section";
import { PostTypeSection } from "~/components/posts/form/post-type-section";
import { PreviewSection } from "~/components/posts/form/preview-section";
import { TechnicalDetailsSection } from "~/components/posts/form/technical-details-section";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { Header } from "~/components/ui/header";
import { H1 } from "~/components/ui/heading";
import { StepIndicator } from "~/components/ui/step-indicator";
import { createPost, searchTechnologies, updatePost } from "~/features/posts/post.actions";
import { postSchema } from "~/features/posts/post.schema";
import { isProjectNeedType } from "~/lib/utils";

type FormStep = 1 | 2 | 3 | 4;

export type PostFormProps = {
  readonly post?: {
    readonly id: string;
    readonly needType: NeedType;
    readonly secondaryNeedType: NeedType | null;
    readonly title: string;
    readonly description: string;
    readonly technologies: string[];
    readonly githubRepo: string | null;
    readonly allowRatings: boolean;
    readonly allowComments: boolean;
    readonly hasComments?: boolean;
  };
};

export function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const isEditMode = !!post;
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [showCommentWarning, setShowCommentWarning] = useState(false);
  const [initialAllowComments] = useState(isEditMode ? post.allowComments : true);
  const [attemptedValidation, setAttemptedValidation] = useState(false);

  const form = useForm<CreatePostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: isEditMode
      ? {
          needType: post.needType,
          secondaryNeedType: post.secondaryNeedType,
          technologies: post.technologies || [],
          title: post.title,
          description: post.description,
          githubRepo: post.githubRepo ?? "",
          allowRatings: post.allowRatings,
          allowComments: post.allowComments,
        }
      : {
          needType: NeedType.FEEDBACK,
          secondaryNeedType: null,
          technologies: [],
          title: "",
          description: "",
          githubRepo: "",
          allowRatings: false,
          allowComments: true,
        },
    mode: "onSubmit",
  });

  const { watch, setValue, trigger, formState } = form;
  const { errors, isSubmitting } = formState;
  const formData = watch();
  const needType = watch("needType");
  const secondaryNeedType = watch("secondaryNeedType");
  const technologies = watch("technologies");
  const allowComments = watch("allowComments");
  const canHaveRatings = needType === NeedType.FEEDBACK || secondaryNeedType === NeedType.FEEDBACK;

  const getStepValidationFields = (step: FormStep, needType: NeedType, secondaryNeedType: NeedType | null | undefined): Array<keyof CreatePostInput> => {
    const isProjectPost = isProjectNeedType(needType) || (secondaryNeedType && isProjectNeedType(secondaryNeedType));

    switch (step) {
      case 1:
        return ["needType"];
      case 2:
        return ["title", "description"];
      case 3:
        if (isProjectPost) {
          return ["technologies", "githubRepo", "allowRatings", "allowComments"];
        }
        return ["allowRatings", "allowComments"];
      case 4:
        return [];
      default:
        return [];
    }
  };

  useEffect(() => {
    if (isEditMode && initialAllowComments && !allowComments && post.hasComments) {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setShowCommentWarning(true);
    } else {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setShowCommentWarning(false);
    }
  }, [allowComments, initialAllowComments, isEditMode, post?.hasComments]);

  useEffect(() => {
    if (!canHaveRatings && formData.allowRatings) {
      setValue("allowRatings", false);
    }
  }, [canHaveRatings, formData.allowRatings, setValue]);

  useEffect(() => {
    const canHaveSecondary = needType === NeedType.FEEDBACK || needType === NeedType.CONTRIBUTION;
    if (!canHaveSecondary && secondaryNeedType) {
      setValue("secondaryNeedType", null, { shouldValidate: true });
    }
  }, [needType, secondaryNeedType, setValue]);

  useEffect(() => {
    const isProjectPost = isProjectNeedType(needType) || isProjectNeedType(secondaryNeedType);
    if (!isProjectPost) {
      setValue("technologies", [], { shouldValidate: false, shouldDirty: true });
      setValue("githubRepo", "", { shouldValidate: false, shouldDirty: true });
    }
  }, [needType, secondaryNeedType, setValue]);

  const handleTechSearch = async (query: string) => {
    if (query && query.length >= 2) {
      try {
        const results = await searchTechnologies(query);
        if (results) {
          setSuggestions(results.filter(tech => !technologies?.includes(tech)) ?? []);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const nextStep = async () => {
    if (currentStep < 4) {
      setIsValidating(true);
      setAttemptedValidation(true);
      const fieldsToValidate = getStepValidationFields(currentStep, needType, secondaryNeedType);
      const isStepValid = await trigger(fieldsToValidate);
      setIsValidating(false);

      if (isStepValid) {
        setCurrentStep(prev => (prev + 1) as FormStep);
        setAttemptedValidation(false);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => (prev - 1) as FormStep);
    }
  };

  const onSubmit = async (data: CreatePostInput) => {
    try {
      const isProjectPost = isProjectNeedType(data.needType) || (data.secondaryNeedType && isProjectNeedType(data.secondaryNeedType));
      const formData = { ...data };

      if (!isProjectPost) {
        formData.technologies = [];
        formData.githubRepo = null;
      }

      const payload = new FormData();
      payload.append("title", formData.title.trim());
      payload.append("description", formData.description.trim());
      payload.append("needType", formData.needType);
      payload.append("secondaryNeedType", formData.secondaryNeedType ?? "");

      const techData = Array.isArray(formData.technologies)
        ? formData.technologies.filter(tech => tech.trim() !== "")
        : [];

      payload.append("technologies", JSON.stringify(techData));
      payload.append("githubRepo", formData.githubRepo ? formData.githubRepo.trim() : "");
      payload.append("allowRatings", String(Boolean(formData.allowRatings)));
      payload.append("allowComments", String(Boolean(formData.allowComments)));

      if (formData.bannerImage) {
        payload.append("bannerImage", formData.bannerImage);
      }

      if (isEditMode && post) {
        await updatePost(post.id, payload);
      } else {
        await createPost(payload);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const currentStepHasErrors = () => {
    if (!attemptedValidation)
      return false;

    const fieldsToCheck = getStepValidationFields(currentStep, needType, secondaryNeedType);
    return fieldsToCheck.some(field => field in errors);
  };

  const handleCancel = () => {
    if (isEditMode && post) {
      router.push(`/p/${post.id}`);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <Header>
        <H1 className="text-xl md:text-3xl font-bold">
          {isEditMode ? "Edit Post" : "Create Post"}
        </H1>
      </Header>
      <StepIndicator currentStep={currentStep} totalSteps={4} className="mb-4 md:mb-6" />
      <Form {...form}>
        <form
          onSubmit={currentStep === 4 ? form.handleSubmit(onSubmit) : e => e.preventDefault()}
          noValidate
          className="text-sm md:text-base"
        >
          {currentStep === 1 && (
            <PostTypeSection
              control={form.control}
              isEditMode={isEditMode}
              initialNeedType={isEditMode ? post.needType : undefined}
            />
          )}
          {currentStep === 2 && (
            <PostDetailsSection
              control={form.control}
              needType={needType}
              isSubmitting={isSubmitting}
            />
          )}
          {currentStep === 3 && (
            <TechnicalDetailsSection
              control={form.control}
              isSubmitting={isSubmitting}
              needType={needType}
              secondaryNeedType={secondaryNeedType}
              canHaveRatings={canHaveRatings}
              suggestions={suggestions}
              handleTechSearch={handleTechSearch}
            />
          )}
          {currentStep === 4 && <PreviewSection data={formData} />}

          {currentStepHasErrors() && (
            <Alert variant="destructive" className="mb-4 mt-4 md:mb-6 bg-destructive/10 border-destructive/20">
              <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
              <AlertTitle className="text-sm md:text-base font-semibold">Validation errors</AlertTitle>
              <AlertDescription className="text-xs md:text-sm">
                Please fix the highlighted errors before continuing.
              </AlertDescription>
            </Alert>
          )}

          {showCommentWarning && (
            <Alert variant="destructive" className="mb-4 mt-4 md:mb-6 bg-destructive/10 border-destructive/20">
              <AlertCircle className="h-3 w-3 md:h-4 md:w-4" />
              <AlertTitle className="text-sm md:text-base font-semibold">Comments will be hidden</AlertTitle>
              <AlertDescription className="text-xs md:text-sm">
                Disabling comments will hide existing comments from viewers. They will not be deleted and will reappear if you enable comments again.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-wrap justify-between mt-4 md:mt-6 pt-3 md:pt-4 border-t gap-2 md:gap-3">
            {isEditMode && (
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                size="sm"
                className="text-xs md:text-sm h-8 md:h-10 font-medium"
              >
                Cancel
              </Button>
            )}
            <div className="flex gap-2 md:gap-3 ml-auto">
              {currentStep > 1 && (
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="outline"
                  size="sm"
                  className="text-xs md:text-sm h-8 md:h-10 font-medium"
                >
                  Back
                </Button>
              )}
              {currentStep < 4
                ? (
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        nextStep();
                      }}
                      variant="default"
                      size="sm"
                      className="text-xs md:text-sm h-8 md:h-10 font-medium"
                      disabled={isValidating}
                    >
                      {isValidating ? "Validating..." : "Continue"}
                    </Button>
                  )
                : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      variant="default"
                      size="sm"
                      className="text-xs md:text-sm h-8 md:h-10 font-medium"
                    >
                      {isSubmitting ? "Saving..." : isEditMode ? "Update Post" : "Create Post"}
                    </Button>
                  )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
