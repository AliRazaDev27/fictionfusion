"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { saveQuiz } from "@/app/(fullscreen)/quiz/actions"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Question } from "@/app/(fullscreen)/quiz/util"
import { useToast } from "@/components/ui/use-toast"

interface SaveQuizDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  topic: string
  quizQuestions: Question[]
}

export function SaveQuizDialog({ open, onOpenChange, topic, quizQuestions }: SaveQuizDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      setTitle(topic || "")
      setDescription("")
    }
  }, [open, topic])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Quiz title cannot be empty.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const quizToSave = {
        title: title.trim(),
        topic: topic,
        description: description.trim(),
        questionCount: quizQuestions.length,
        data: { questions: quizQuestions, topic: topic }, // Ensure data matches the expected structure
      }
      await saveQuiz(quizToSave)
      toast({
        title: "Success",
        description: "Quiz saved successfully!",
      })
      onOpenChange(false)
    } catch (error: any) {
      console.error("Failed to save quiz:", error)
      toast({
        title: "Error",
        description: `Failed to save quiz: ${error.message || "Unknown error"}`,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Quiz</DialogTitle>
          <DialogDescription>Save this generated quiz to your collections.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Quiz Title</Label>
            <Input
              id="title"
              placeholder="e.g., React Fundamentals Quiz"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              value={topic}
              readOnly
              className="bg-muted/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add a brief description for your quiz..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving || !title.trim()}>
              {isSaving ? "Saving..." : "Save Quiz"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
