"use client";

import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ProjectBookmark } from "~/components/projects/project-bookmark";
import { ActionButton } from "~/components/ui/action-button";
import { ConfirmDialog } from "~/components/ui/confirm-dialog";
import { deleteProject } from "~/features/projects/project.actions";
import { toastError, toastSuccess } from "~/lib/toast";

type ProjectActionsProps = {
  projectId: string;
  isOwnProject: boolean;
  isBookmarked: boolean;
};

export function ProjectActions({ projectId, isOwnProject, isBookmarked }: ProjectActionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProject(projectId);
      toastSuccess("Project Deleted", {
        description: "Your project has been permanently deleted",
      });
      router.push("/p");
    } catch {
      toastError("Failed to Delete Project", {
        description: "An error occurred while deleting your project. Please try again.",
      });
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isOwnProject) {
    return (
      <>
        <div className="flex gap-2">
          <Link href={`/p/${projectId}/edit`}>
            <ActionButton icon={<Edit />}>
              Edit
            </ActionButton>
          </Link>
          <ActionButton
            icon={<Trash2 />}
            variant="destructive"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting}
          >
            Delete
          </ActionButton>
        </div>
        <ConfirmDialog
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
          title="Delete Project"
          description="Are you sure you want to delete this project? This action cannot be undone and will delete all comments and ratings."
          confirmText="Delete Project"
          cancelText="Cancel"
          onConfirm={handleDelete}
        />
      </>
    );
  }

  return (
    <ProjectBookmark
      projectId={projectId}
      initialBookmarked={isBookmarked}
    />
  );
}
