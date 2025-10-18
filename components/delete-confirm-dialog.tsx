"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeleteConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  quizTitle: string
  onConfirm: () => void
}

export function DeleteConfirmDialog({ open, onOpenChange, quizTitle, onConfirm }: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Quiz Collection?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{quizTitle}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-2">
          <AlertDialogCancel className="flex-1">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            Delete
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
