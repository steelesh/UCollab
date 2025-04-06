"use client";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

type ConfirmDialogProps = {
  readonly open: boolean;
  readonly onOpenChangeAction: (open: boolean) => void;
  readonly title: string;
  readonly description: string;
  readonly confirmText: string;
  readonly cancelText: string;
  readonly onConfirmAction: () => void;
};

export function ConfirmDialog({
  open,
  onOpenChangeAction,
  title,
  description,
  confirmText,
  cancelText,
  onConfirmAction,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction} modal={false}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChangeAction(false)}>
            {cancelText}
          </Button>
          <Button variant="destructive" onClick={onConfirmAction}>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
