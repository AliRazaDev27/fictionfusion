"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Quiz {
  id: string
  title: string
  topic: string
  description: string
  questionCount: number
  createdDate: string
}

interface EditQuizModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  quiz: Quiz
  onSave: (quiz: Quiz) => void
}

export function EditQuizModal({ open, onOpenChange, quiz, onSave }: EditQuizModalProps) {
  const [title, setTitle] = useState("")
  const [topic, setTopic] = useState("")
  const [description, setDescription] = useState("")
  const [questionCount, setQuestionCount] = useState("")

  useEffect(() => {
    if (quiz) {
      setTitle(quiz.title)
      setTopic(quiz.topic)
      setDescription(quiz.description)
      setQuestionCount(quiz.questionCount.toString())
    }
  }, [quiz, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && topic.trim()) {
      onSave({
        ...quiz,
        title,
        topic,
        description,
        questionCount: Number.parseInt(questionCount) || 10,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Quiz Collection</DialogTitle>
          <DialogDescription>Update your quiz details</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Quiz Title</Label>
            <Input id="edit-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-topic">Topic/Category</Label>
            <Input id="edit-topic" value={topic} onChange={(e) => setTopic(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-questionCount">Number of Questions</Label>
            <Input
              id="edit-questionCount"
              type="number"
              min="1"
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
            />
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
