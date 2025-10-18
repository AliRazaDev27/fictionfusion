"use client"

import { useState } from "react"
import QuizContainer from "./components/quiz-container"
import QuizResults from "./components/quiz-results"
import "./styles.css"

export default function Home() {
  const [quizStarted, setQuizStarted] = useState(false)
  const [results, setResults] = useState<{ score: number; total: number } | null>(null)

  const handleQuizComplete = (score: number, total: number) => {
    setResults({ score, total })
  }

  const handleRestart = () => {
    setResults(null)
    setQuizStarted(false)
  }

  if (results) {
    return <QuizResults score={results.score} total={results.total} onRestart={handleRestart} />
  }

  if (!quizStarted) {
    return (
      <div className="min-h-[calc(100vh-70px)] bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="mb-8">
            <div className="inline-block p-3 rounded-lg bg-primary/10 border border-primary/20 mb-4">
              <div className="text-4xl">🎯</div>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4">Quiz Master</h1>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Test your knowledge with our modern quiz platform. Challenge yourself and see how well you know the subject.
          </p>
          <button
            onClick={() => setQuizStarted(true)}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
          >
            Start Quiz
          </button>
        </div>
      </div>
    )
  }

  return <QuizContainer onComplete={handleQuizComplete} />
}
