"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

interface LoadConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  quizTitle: string
  onConfirm: () => void
}

export function LoadConfirmDialog({ open, onOpenChange, quizTitle, onConfirm }: LoadConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Load Quiz Collection</DialogTitle>
          <DialogDescription>Ready to load your quiz</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-6">
          <CheckCircle className="h-12 w-12 text-blue-500" />
          <div className="text-center">
            <p className="font-medium text-foreground">&quot;{quizTitle}&quot;</p>
            <p className="mt-2 text-sm text-muted-foreground">is ready to be loaded</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => onOpenChange(false)} className="flex-1 bg-red-500 hover:bg-red-600 text-white">
            Cancel
          </Button>
          <Button onClick={onConfirm} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
            Load Quiz
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
