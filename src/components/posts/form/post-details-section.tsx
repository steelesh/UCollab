"use client";

import type { NeedType } from "@prisma/client";
import type { Control } from "react-hook-form";

import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

import type { CreatePostInput } from "~/features/posts/post.schema";

import { ConfirmDialog } from "~/components/ui/confirm-dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { ImageCropper } from "~/components/ui/image-cropper";
import { Input } from "~/components/ui/input";
import { Section } from "~/components/ui/section";
import { Textarea } from "~/components/ui/textarea";

type PostDetailsSectionProps = {
  readonly control: Control<CreatePostInput>;
  readonly needType: NeedType;
  readonly isSubmitting: boolean;
};

export function PostDetailsSection({
  control,
  isSubmitting,
}: PostDetailsSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const bannerImage = control._formValues.bannerImage;

  useEffect(() => {
    if (bannerImage instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(bannerImage);
    } else if (typeof bannerImage === "string") {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setPreviewUrl(bannerImage);
    } else {
      // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
      setPreviewUrl(null);
    }
  }, [bannerImage]);

  const handleFileChange = (file: File | null) => {
    setFileError(null);

    if (file) {
      control._formValues.bannerImage = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      control._formValues.bannerImage = null;
      setPreviewUrl(null);

      const fileInput = document.getElementById("bannerImage") as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    }
  };

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
                {/* */}
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
                {/* */}
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

        <FormField
          control={control}
          name="bannerImage"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel className="flex justify-between items-center">
                <span>Banner Image (Optional)</span>
                {bannerImage && (
                  <button
                    type="button"
                    onClick={() => setDeleteDialogOpen(true)}
                    className="text-muted-foreground hover:text-destructive transition-colors flex items-center text-xs gap-1"
                    disabled={isSubmitting}
                  >
                    <Trash2Icon className="size-3" />
                    Remove Image
                  </button>
                )}
              </FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <div className="flex items-center gap-2">
                      <Input
                        id="bannerImage"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileChange(file);
                            if (!fileError) {
                              setDialogOpen(true);
                            }
                          }
                        }}
                        disabled={isSubmitting || !!bannerImage}
                        {...field}
                      />
                    </div>
                    {previewUrl && (
                      <div className="mt-2">
                        <p className="font-medium mb-1">Preview</p>
                        <div className="relative aspect-video rounded-md overflow-hidden max-h-48 bg-muted flex items-center justify-center">
                          <Image
                            fill
                            src={previewUrl}
                            alt="Banner preview"
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </div>
                    )}
                    {value && (
                      <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                        <p>
                          {typeof value === "string" ? "Image uploaded" : value.name}
                          {" "}
                          {value instanceof File && (
                            <>
                              (
                              {(value.size / 1024 / 1024).toFixed(2)}
                              {" "}
                              MB)
                            </>
                          )}
                        </p>
                      </div>
                    )}

                    {fileError && (
                      <p className="text-xs text-destructive mt-1">{fileError}</p>
                    )}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {control._formValues.bannerImage instanceof File && !fileError && (
          <ImageCropper
            dialogOpen={dialogOpen}
            setDialogOpen={setDialogOpen}
            selectedFile={control._formValues.bannerImage}
            onFileChange={handleFileChange}
          />
        )}

        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Remove Banner Image"
          description="Are you sure you want to remove the banner image? This action cannot be undone."
          confirmText="Remove"
          cancelText="Cancel"
          onConfirm={() => {
            const fileInput = document.getElementById("bannerImage") as HTMLInputElement;
            if (fileInput) {
              fileInput.value = "";
            }
            handleFileChange(null);
            setDeleteDialogOpen(false);
          }}
        />
      </div>
    </Section>
  );
}
