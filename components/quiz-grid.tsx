"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Edit2, Trash2, Play, MoreVertical } from "lucide-react"

interface Quiz {
  id: string
  title: string
  topic: string
  description: string
  questionCount: number
  createdDate: string
}

interface QuizGridProps {
  quizzes: Quiz[]
  onEdit: (quiz: Quiz) => void
  onDelete: (quiz: Quiz) => void
  onLoad: (quiz: Quiz) => void
}

export function QuizGrid({ quizzes, onEdit, onDelete, onLoad }: QuizGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((quiz) => (
        <Card
          key={quiz.id}
          className="group relative overflow-hidden border-border bg-card transition-all duration-300 hover:shadow-lg hover:border-blue-500/50 animate-in fade-in slide-in-from-bottom-4"
        >
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <CardTitle className="line-clamp-2 text-lg text-foreground">{quiz.title}</CardTitle>
                <CardDescription className="mt-1">{quiz.topic}</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(quiz)} className="gap-2">
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onLoad(quiz)} className="gap-2">
                    <Play className="h-4 w-4" />
                    Load
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(quiz)} className="gap-2 text-destructive">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="line-clamp-2 text-sm text-muted-foreground">{quiz.description}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{quiz.questionCount} questions</span>
              <span className="text-xs text-muted-foreground">{new Date(quiz.createdDate).toLocaleDateString()}</span>
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={() => onEdit(quiz)} variant="outline" size="sm" className="flex-1 gap-2">
                <Edit2 className="h-4 w-4" />
                Edit
              </Button>
              <Button
                onClick={() => onLoad(quiz)}
                size="sm"
                className="flex-1 gap-2 bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Play className="h-4 w-4" />
                Load
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
