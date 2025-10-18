"use client"

import { useState } from "react"
import { generateQuiz } from "../actions"
import { QuizGrid } from "@/components/quiz-grid"
import { CreateQuizModal } from "@/components/create-quiz-modal"
import { EditQuizModal } from "@/components/edit-quiz-modal"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { LoadConfirmDialog } from "@/components/load-confirm-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, Filter } from "lucide-react"

interface Quiz {
  id: string
  title: string
  topic: string
  description: string
  questionCount: number
  createdDate: string
}

const MOCK_QUIZZES: Quiz[] = [
  {
    id: "1",
    title: "React Fundamentals",
    topic: "React Basics",
    description: "Learn the core concepts of React",
    questionCount: 15,
    createdDate: "2024-10-15",
  },
  {
    id: "2",
    title: "Advanced HTML",
    topic: "HTML Advanced",
    description: "Master advanced HTML techniques",
    questionCount: 12,
    createdDate: "2024-10-10",
  },
  {
    id: "3",
    title: "CSS Grid Mastery",
    topic: "CSS Advanced",
    description: "Deep dive into CSS Grid layouts",
    questionCount: 18,
    createdDate: "2024-10-08",
  },
  {
    id: "4",
    title: "JavaScript ES6+",
    topic: "JavaScript Advanced",
    description: "Modern JavaScript features and patterns",
    questionCount: 20,
    createdDate: "2024-10-05",
  },
]

export  function Collections() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(MOCK_QUIZZES)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isLoadOpen, setIsLoadOpen] = useState(false)
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)

  const topics = Array.from(new Set(quizzes.map((q) => q.topic)))

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.topic.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTopic = !selectedTopic || quiz.topic === selectedTopic
    return matchesSearch && matchesTopic
  })

  const handleCreate = async (newQuiz: Omit<Quiz, "id" | "createdDate">) => {
    const generatedData = await generateQuiz(`$Generate exactly ${newQuiz.questionCount}
       questions about this topic: ${newQuiz.topic} given this title '${newQuiz.title}' and description '${newQuiz.description}'`)
    // The logic to add to the quiz list will be handled after the user saves the generated quiz.
    // For now, we just return the generated data to the modal.
    setIsCreateOpen(false)
    return generatedData
  }

  const handleEdit = (updatedQuiz: Quiz) => {
    setQuizzes(quizzes.map((q) => (q.id === updatedQuiz.id ? updatedQuiz : q)))
    setIsEditOpen(false)
    setSelectedQuiz(null)
  }

  const handleDelete = () => {
    if (selectedQuiz) {
      setQuizzes(quizzes.filter((q) => q.id !== selectedQuiz.id))
      setIsDeleteOpen(false)
      setSelectedQuiz(null)
    }
  }

  const handleLoad = () => {
    setIsLoadOpen(false)
    setSelectedQuiz(null)
  }

  const openEdit = (quiz: Quiz) => {
    setSelectedQuiz(quiz)
    setIsEditOpen(true)
  }

  const openDelete = (quiz: Quiz) => {
    setSelectedQuiz(quiz)
    setIsDeleteOpen(true)
  }

  const openLoad = (quiz: Quiz) => {
    setSelectedQuiz(quiz)
    setIsLoadOpen(true)
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Quiz Collections</h1>
                <p className="mt-2 text-muted-foreground">Manage and organize your quiz library</p>
              </div>
              <Button onClick={() => setIsCreateOpen(true)} className="gap-2 bg-blue-500 hover:bg-blue-600 text-white">
                <Plus className="h-4 w-4" />
                New Quiz Collection
              </Button>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search quizzes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Filter className="h-4 w-4" />
                    {selectedTopic ? `Topic: ${selectedTopic}` : "Filter by Topic"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setSelectedTopic(null)}>All Topics</DropdownMenuItem>
                  {topics.map((topic) => (
                    <DropdownMenuItem key={topic} onClick={() => setSelectedTopic(topic)}>
                      {topic}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {filteredQuizzes.length > 0 ? (
          <QuizGrid quizzes={filteredQuizzes} onEdit={openEdit} onDelete={openDelete} onLoad={openLoad} />
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-12 text-center">
            <p className="text-lg text-muted-foreground">No quizzes found</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchTerm || selectedTopic
                ? "Try adjusting your search or filters"
                : "Create your first quiz collection"}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateQuizModal open={isCreateOpen} onOpenChange={setIsCreateOpen} onCreate={handleCreate} />
      {selectedQuiz && (
        <>
          <EditQuizModal open={isEditOpen} onOpenChange={setIsEditOpen} quiz={selectedQuiz} onSave={handleEdit} />
          <DeleteConfirmDialog
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            quizTitle={selectedQuiz.title}
            onConfirm={handleDelete}
          />
          <LoadConfirmDialog
            open={isLoadOpen}
            onOpenChange={setIsLoadOpen}
            quizTitle={selectedQuiz.title}
            onConfirm={handleLoad}
          />
        </>
      )}
    </main>
  )
}
