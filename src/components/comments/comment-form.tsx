"use client";

import type { Comment, Post, User } from "@prisma/client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import type { TiptapRef } from "~/components/ui/tiptap";
import type { CommentFormData } from "~/features/comments/comment.schema";

import { Button } from "~/components/ui/button";
import Tiptap from "~/components/ui/tiptap";
import { commentSchema } from "~/features/comments/comment.schema";

type CommentFormProps = {
  postId: Post["id"];
  currentUserId: User["id"];
  onSubmit: (content: Comment["content"], hasChanged: boolean) => Promise<void>;
  initialContent?: Comment["content"];
  isEditing?: boolean;
  onCancel?: () => void;
};

function normalizeHtml(html: string): string {
  if (typeof document === "undefined")
    return html;
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent?.trim().replace(/\s+/g, " ") || "";
}

export function CommentForm({
  postId,
  currentUserId,
  onSubmit,
  initialContent = "",
  isEditing = false,
  onCancel,
}: CommentFormProps) {
  const editorRef = useRef<TiptapRef>(null);
  const [hasChanged, setHasChanged] = useState(false);
  const initialContentNormalized = useRef("");

  useEffect(() => {
    initialContentNormalized.current = normalizeHtml(initialContent);
  }, [initialContent]);

  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
    clearErrors,
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: initialContent,
      postId,
    },
    mode: "onSubmit",
  });

  const handleFormSubmit = async (data: CommentFormData) => {
    if (isEditing && !hasChanged) {
      onCancel?.();
      return;
    }

    try {
      await onSubmit(data.content, hasChanged);
      if (!isEditing) {
        reset({ content: "", postId }, { keepErrors: false, keepDirty: false });
        editorRef.current?.clearContent();
        clearErrors();
      }
    } catch {
      // TODO: handle error, show toast or something
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <Tiptap
          ref={editorRef}
          content={initialContent}
          onChange={(content) => {
            setValue("content", content, { shouldValidate: false });
            const normalizedNew = normalizeHtml(content);
            setHasChanged(normalizedNew !== initialContentNormalized.current);
          }}
          disabled={isSubmitting}
          currentUserId={currentUserId}
        />
        {errors.content && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.content.message}</p>}
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button
            size="sm"
            type="button"
            variant="outline"
            onClick={onCancel}
            className="cursor-pointer"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button
          size="sm"
          type="submit"
          variant="outline"
          className="cursor-pointer"
          disabled={isSubmitting || (isEditing && !hasChanged)}
        >
          {isSubmitting ? "Saving..." : isEditing ? (hasChanged ? "Save Changes" : "No Changes") : "Post Comment"}
        </Button>
      </div>
    </form>
  );
}
