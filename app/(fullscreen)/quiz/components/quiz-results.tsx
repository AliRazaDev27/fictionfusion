"use client"

interface QuizResultsProps {
  score: number
  total: number
  onRestart: () => void
  onExit: () => void
}

export default function QuizResults({ score, total, onRestart, onExit }: QuizResultsProps) {
  const percentage = Math.round((score / total) * 100)
  const getPerformanceMessage = () => {
    if (percentage === 100) return "Perfect Score! Outstanding!"
    if (percentage >= 80) return "Excellent Work!"
    if (percentage >= 60) return "Good Job!"
    if (percentage >= 40) return "Not Bad!"
    return "Keep Practicing!"
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="relative w-40 h-40 rounded-full bg-card border-4 border-primary flex items-center justify-center shadow-lg shadow-primary/10">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary">{percentage}%</div>
              <div className="text-sm text-muted-foreground mt-1">
                {score} of {total}
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-foreground mb-4">{getPerformanceMessage()}</h1>
        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
          You answered {score} out of {total} questions correctly.{" "}
          {percentage < 100 && "Try again to improve your score!"}
        </p>

        <button
          onClick={onRestart}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
        >
          Retake Quiz
        </button>
        <div>
        <button
          onClick={onExit}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
        >
          Exit
        </button>
        </div>

      </div>
    </div>
  )
}
