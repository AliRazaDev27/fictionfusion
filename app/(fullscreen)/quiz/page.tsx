"use client"

import { useState, useEffect } from "react"
import QuizContainer from "./components/quiz-container"
import QuizResults from "./components/quiz-results"
import "./styles.css"
import { Question, shuffleArray} from "./util"
import { generateQuiz, getQuizzes } from "./actions"
import { Button } from "@/components/ui/button"
import { Sparkles, BookOpen, Zap, Library } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collections } from "./components/collections"

interface Quiz {
  id: number
  title: string
  topic: string
  description: string | null
  questionCount: number
  createdAt: Date
  data: any
}

interface DisplayQuiz {
  id: string
  title: string
  topic: string
  description: string
  questionCount: number
  createdDate: string
}


type QuizMode = "learn" | "test"

export default function Home() {
  const [quizStarted, setQuizStarted] = useState(false)
  const [results, setResults] = useState<{ score: number; total: number } | null>(null)
  const [quizMode, setQuizMode] = useState<QuizMode>("learn")
  const [QUIZ_QUESTIONS, setQUIZ_QUESTIONS] = useState<Array<Question>|null>(null)
  const [quizTopic, setQuizTopic] = useState("")
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoadingCollections, setIsLoadingCollections] = useState(false)
  const [allQuizzes, setAllQuizzes] = useState<DisplayQuiz[]>([])

  useEffect(() => {
      const fetchQuizzes = async () => {
        const dbQuizzes: Quiz[] = await getQuizzes()
        const displayQuizzes: DisplayQuiz[] = dbQuizzes.map(q => ({
          id: q.id.toString(),
          title: q.title,
          topic: q.topic,
          description: q.description ?? "",
          questionCount: q.questionCount,
          createdDate: new Date(q.createdAt).toLocaleDateString(),
        }))
        setAllQuizzes(displayQuizzes)
      }
      fetchQuizzes()
  }, [])

  const handleQuizComplete = (score: number, total: number) => {
    setResults({ score, total })
  }

  const handleRestart = () => {
    setResults(null)
    // setQuizStarted(false)
    // setQUIZ_QUESTIONS(shuffleArray(_QUIZ_QUESTIONS))
  }

  const handleExit = () => {
    setResults(null)
    setQuizStarted(false)
    // setQUIZ_QUESTIONS(shuffleArray(_QUIZ_QUESTIONS))
  }

  const handleExitToCollection = () => {
    setResults(null)
    setQuizStarted(false)
    setIsLoadingCollections(true)
  }

  const handleGenerateQuiz = ()=>{
    try{
      if(!!quizTopic){
        setIsGenerating(true)
        generateQuiz(quizTopic).then((response)=>{
          setQUIZ_QUESTIONS(response.questions)
          console.log(response)
          setIsGenerating(false)
          setTopic(response.topic.trim());
          setQuizStarted(true)
        })
      }
    }
    catch(error:any){
      console.log(error);
    }
  }

  const handleLoadCollections = () => {
    console.log("loading collections")
    setIsLoadingCollections(true);

  }

  const handleLoadQuiz = (quiz: any) => {
    setQUIZ_QUESTIONS(quiz.data.questions)
    setTopic(quiz.topic)
    setQuizStarted(true)
    setIsLoadingCollections(false) // Hide collections after loading quiz
  }

  if(isLoadingCollections) return <Collections onLoadQuiz={handleLoadQuiz} quizzes={allQuizzes} setQuizzes={setAllQuizzes} />

  if (results) {
    return <QuizResults score={results.score} total={results.total} onRestart={handleRestart} onExit={handleExit} />
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">Master Any Subject</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Generate unlimited quizzes with AI or explore our curated collection of learning materials
          </p>
        </div>

        {/* Mode Selector */}
        <div className="mb-8 flex justify-center">
          <Tabs value={quizMode} onValueChange={(v) => setQuizMode(v as QuizMode)} className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-2 bg-muted/70">
              <TabsTrigger value="learn" className="flex items-center gap-2 cursor-pointer hover:bg-neutral-800">
                <BookOpen className="w-4 h-4" />
                <span className="hidden sm:inline">Learn Mode</span>
                <span className="sm:hidden">Learn</span>
              </TabsTrigger>
              <TabsTrigger value="test" className="flex items-center gap-2 cursor-pointer hover:bg-neutral-800">
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">Test Mode</span>
                <span className="sm:hidden">Test</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Input Section */}
        <div className="space-y-4 mb-8">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Sparkles className="w-5 h-5" />
            </div>
            <Input
              placeholder="Enter a topic, subject, or concept to generate a quiz..."
              value={quizTopic}
              onChange={(e) => setQuizTopic(e.target.value)}
              className="pl-12 h-12 text-base bg-neutral-900 border-border/60 transition-colors"
              onKeyDown={(e) => e.key === "Enter" && handleGenerateQuiz()}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 items-center justify-between">
            <Button
              variant="outline"
              size="lg"
              onClick={handleLoadCollections}
              className="gap-2 cursor-pointer border-border/60 hover:bg-muted/50 bg-neutral-900"
            >
              <Library className="w-4 h-4" />
              <span className="hidden sm:inline">Collections</span>
              <span className="sm:hidden">Collections</span>
            </Button>
            <Button
              size="lg"
              onClick={handleGenerateQuiz}
              disabled={!quizTopic.trim() || isGenerating}
              className="cursor-pointer disabled:cursor-not-allowed 
              gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="hidden sm:inline">Generating...</span>
                  <span className="sm:hidden">Wait...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline">Start Quiz</span>
                  <span className="sm:hidden">Start</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </main>

      </div>
    )
  }

  return <QuizContainer onComplete={handleQuizComplete} topic={topic}  QUIZ_QUESTIONS={QUIZ_QUESTIONS!} mode={quizMode} onExitToCollections={handleExitToCollection} />
}
