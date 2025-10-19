"use client"

import { useRef, useState } from "react"
import QuestionCard from "./question-card"
import ProgressBar from "./progress-bar"
import { Question } from "../util"
import { Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SaveQuizDialog } from "@/components/save-quiz-dialog"

interface QuizContainerProps {
  topic:string
  onComplete: (score: number, total: number) => void
  QUIZ_QUESTIONS: Question[]
  mode: "learn" | "test"
}

export default function QuizContainer({ topic,onComplete,QUIZ_QUESTIONS, mode }: QuizContainerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [isSaveQuizDialogOpen, setIsSaveQuizDialogOpen] = useState(false)
  const isLastAnswerCorrect = useRef(false);

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === QUIZ_QUESTIONS.length - 1

  const handleSelectAnswer = (optionIndex: number) => {
    if (answered) return

    setSelectedAnswer(optionIndex)
    setAnswered(true)

    const isCorrect = currentQuestion.options[optionIndex] === currentQuestion.answer
    if (!isLastQuestion && isCorrect) {
      setScore(score + 1)
    }
    if(isLastQuestion && isCorrect) {
      isLastAnswerCorrect.current = true;
    }

    if (mode === "test") {
      setTimeout(() => {
        handleNext();
      }, 500)
    }
  }

  const handleNext = () => {
    if (isLastQuestion) {
      onComplete(isLastAnswerCorrect.current ? score+1:score, QUIZ_QUESTIONS.length)
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setAnswered(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center p-4 md:p-8">
      <div className="max-w-2xl w-full mx-auto _flex-1 flex flex-col gap-4 justify-center">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{topic}</h1>
            <p className="text-muted-foreground">
              Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSaveQuizDialogOpen(true)}
            className="text-muted-foreground hover:text-foreground"
            title="Save Quiz"
          >
            <Bookmark className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress Bar */}
        <ProgressBar current={currentQuestionIndex + 1} total={QUIZ_QUESTIONS.length} />

        {/* Question Card */}
        <div className="flex-1 flex items-center justify-center">
          <QuestionCard
            question={currentQuestion.question}
            options={currentQuestion.options}
            selectedAnswer={selectedAnswer}
            correctAnswer={currentQuestion.answer}
            answered={answered}
            onSelectAnswer={handleSelectAnswer}
            mode={mode}
          />
        </div>

        {mode === "learn" && (
          <div className="flex justify-end mt-4">
            <button
              onClick={handleNext}
              disabled={!answered}
              className="bg-primary cursor-pointer hover:bg-primary/90 disabled:bg-muted
               disabled:text-muted-foreground text-primary-foreground font-semibold py-3 px-8
                rounded-lg transition-all duration-200 disabled:cursor-not-allowed
                 hover:shadow-lg hover:shadow-primary/20"
            >
              {isLastQuestion ? "Finish" : "Next"}
            </button>
          </div>
        )}
      </div>
      <SaveQuizDialog
        open={isSaveQuizDialogOpen}
        onOpenChange={setIsSaveQuizDialogOpen}
        topic={topic}
        quizQuestions={QUIZ_QUESTIONS}
      />
    </div>
  )
}
