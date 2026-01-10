"use client"

import { useState, useEffect, Dispatch, SetStateAction } from "react"
import { getQuizzes, generateQuiz, updateQuiz, getQuizById } from "../actions"
import { QuizGrid } from "@/components/quiz-grid"
import { CreateQuizModal } from "@/components/create-quiz-modal"
import { EditQuizModal } from "@/components/edit-quiz-modal"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { LoadConfirmDialog } from "@/components/load-confirm-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, Filter } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { models_groq } from "@/lib/ai"
import { ImCross } from "react-icons/im"

interface Quiz {
  id: number
  title: string
  topic: string
  description: string | null
  questionCount: number
  createdAt: Date
  data: any
}

// This will be the type for the component state, which matches what child components expect
interface DisplayQuiz {
  id: string
  title: string
  topic: string
  description: string
  questionCount: number
  createdDate: string
}

interface CollectionsProps {
  isAdmin: boolean
  onLoadQuiz: (quiz: Quiz) => void
  quizzes: DisplayQuiz[]
  setQuizzes: Dispatch<SetStateAction<DisplayQuiz[]>>
  onExit: () => void
}

export function Collections({ isAdmin, onLoadQuiz, quizzes, setQuizzes, onExit }: CollectionsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string | null>(null) // Renamed to avoid conflict
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isLoadOpen, setIsLoadOpen] = useState(false)
  const [selectedQuiz, setSelectedQuiz] = useState<DisplayQuiz | null>(null)
  const [selectedTopicView, setSelectedTopicView] = useState<string | null>(null) // New state for topic view
  const { toast } = useToast()

  const allTopics = Array.from(new Set(quizzes.map((q) => q.topic)))

  const quizzesGroupedByTopic = quizzes.reduce((acc, quiz) => {
    if (!acc[quiz.topic]) {
      acc[quiz.topic] = []
    }
    acc[quiz.topic].push(quiz)
    return acc
  }, {} as Record<string, DisplayQuiz[]>)

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.topic.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTopicFilter = !selectedTopicFilter || quiz.topic === selectedTopicFilter
    return matchesSearch && matchesTopicFilter
  })

  const quizzesToDisplay = selectedTopicView ? quizzesGroupedByTopic[selectedTopicView] || [] : filteredQuizzes

  const handleCreate = async (newQuiz: { title: string; topic: string; description: string; questionCount: number }) => {
    const generatedData = await generateQuiz(
      `Generate exactly ${newQuiz.questionCount} questions about this topic: ${newQuiz.topic} given this title '${newQuiz.title}' and description '${newQuiz.description}'`,
      models_groq[0].id
    )
    // The logic to add to the quiz list will be handled after the user saves the generated quiz.
    // For now, we just return the generated data to the modal.
    setIsCreateOpen(false)
    return generatedData
  }

  const handleEdit = async (updatedQuiz: DisplayQuiz) => {
    try {
      const quizId = Number.parseInt(updatedQuiz.id)
      const result = await updateQuiz(quizId, {
        title: updatedQuiz.title,
        topic: updatedQuiz.topic,
        description: updatedQuiz.description,
        questionCount: updatedQuiz.questionCount,
      })

      if (result.success) {
        setQuizzes(quizzes.map((q) => (q.id === updatedQuiz.id ? updatedQuiz : q)))
        toast({
          title: "Success",
          description: "Quiz updated successfully!",
        })
      } else {
        toast({
          title: "Error",
          description: `Failed to update quiz: ${result.error}`,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Error updating quiz:", error)
      toast({
        title: "Error",
        description: `Failed to update quiz: ${error.message || "Unknown error"}`,
        variant: "destructive",
      })
    } finally {
      setIsEditOpen(false)
      setSelectedQuiz(null)
    }
  }

  const handleDelete = () => {
    if (selectedQuiz) {
      setQuizzes(quizzes.filter((q) => q.id !== selectedQuiz.id))
      setIsDeleteOpen(false)
      setSelectedQuiz(null)
    }
  }

  const handleLoad = async () => {
    if (selectedQuiz) {
      const quizId = Number.parseInt(selectedQuiz.id)
      const fullQuizData = await getQuizById(quizId)
      if (fullQuizData) {
        onLoadQuiz(fullQuizData)
      }
    }
    setIsLoadOpen(false)
    setSelectedQuiz(null)
  }

  const openEdit = (quiz: DisplayQuiz) => {
    setSelectedQuiz(quiz)
    setIsEditOpen(true)
  }

  const openDelete = (quiz: DisplayQuiz) => {
    setSelectedQuiz(quiz)
    setIsDeleteOpen(true)
  }

  const openLoad = (quiz: DisplayQuiz) => {
    setSelectedQuiz(quiz)
    setIsLoadOpen(true)
  }

  return (
    <main className="min-h-screen bg-[#0a0f1a]">
      {/* Header */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <Button onClick={onExit} variant="outline" className="gap-2 bg-red-500 hover:bg-red-600 text-white">
                  <ImCross className="h-2 w-2" />
                  Exit
                </Button>
              </div>
              <div className="text-center">
                <h1 className="text-3xl font-bold text-foreground">Quiz Collections</h1>
                <p className="mt-2 text-muted-foreground">Manage and organize your quiz library</p>
              </div>
              <div title={isAdmin ? "Create a new quiz collection" : "You must be an admin to create a new collection"}>
                <Button disabled={!isAdmin} onClick={() => setIsCreateOpen(true)} className="gap-2 bg-blue-500 hover:bg-blue-600 text-white">
                  <Plus className="h-4 w-4" />
                  New<span className="hidden sm:inline">Quiz Collection</span>
                </Button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search quizzes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-900"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 bg-slate-900">
                    <Filter className="h-4 w-4" />
                    {selectedTopicFilter ? `Topic: ${selectedTopicFilter}` : "Filter by Topic"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setSelectedTopicFilter(null)}>All Topics</DropdownMenuItem>
                  {allTopics.map((topic) => (
                    <DropdownMenuItem key={topic} onClick={() => setSelectedTopicFilter(topic)}>
                      {topic}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {selectedTopicView ? (
          <>
            <Button onClick={() => setSelectedTopicView(null)} variant="outline" className="mb-6 gap-2">
              <ImCross className="h-2 w-2" /> Back to Topics
            </Button>
            {quizzesToDisplay.length > 0 ? (
              <QuizGrid isAdmin={isAdmin} quizzes={quizzesToDisplay} onEdit={openEdit} onDelete={openDelete} onLoad={openLoad} />
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-12 text-center">
                <p className="text-lg text-muted-foreground">No quizzes found for this topic</p>
              </div>
            )}
          </>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {allTopics.length > 0 ? (
              allTopics.map((topic) => (
                <Button
                  key={topic}
                  variant="outline"
                  className="flex flex-col items-center justify-center h-32 sm:text-lg font-semibold bg-[#111827] hover:bg-[#1e293b] border-border"
                  onClick={() => setSelectedTopicView(topic)}
                >
                  {topic} ({quizzesGroupedByTopic[topic]?.length || 0})
                </Button>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-12 text-center col-span-full">
                <p className="text-lg text-muted-foreground">No quizzes found</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchTerm || selectedTopicFilter
                    ? "Try adjusting your search or filters"
                    : "Create your first quiz collection"}
                </p>
              </div>
            )}
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
