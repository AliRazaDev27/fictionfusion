"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface CreateQuizModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (quiz: { title: string; topic: string; description: string; questionCount: number }) => void
}

export function CreateQuizModal({ open, onOpenChange, onCreate }: CreateQuizModalProps) {
  const [title, setTitle] = useState("")
  const [topic, setTopic] = useState("")
  const [description, setDescription] = useState("")
  const [questionCount, setQuestionCount] = useState("10")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim() && topic.trim()) {
      onCreate({
        title,
        topic,
        description,
        questionCount: Number.parseInt(questionCount) || 10,
      })
      setTitle("")
      setTopic("")
      setDescription("")
      setQuestionCount("10")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Quiz Collection</DialogTitle>
          <DialogDescription>Add a new quiz to your collection</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Quiz Title</Label>
            <Input
              id="title"
              placeholder="e.g., React Fundamentals"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="topic">Topic/Category</Label>
            <Input
              id="topic"
              placeholder="e.g., React Basics"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your quiz..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="questionCount">Number of Questions</Label>
            <Input
              id="questionCount"
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
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
