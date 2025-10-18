"use client"

interface QuestionCardProps {
  question: string
  options: string[]
  selectedAnswer: number | null
  correctAnswer: string
  answered: boolean
  onSelectAnswer: (index: number) => void
  mode: "learn" | "test"
}

export default function QuestionCard({
  question,
  options,
  selectedAnswer,
  correctAnswer,
  answered,
  onSelectAnswer,
  mode,
}: QuestionCardProps) {
  return (
    <div className="w-full max-w-xl">
      {/* Question */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground text-balance leading-relaxed">{question}</h2>
      </div>

      <div className="space-y-2">
        {options.map((option, index) => {
          const isSelected = selectedAnswer === index
          const isCorrect = options[index] === correctAnswer
          const showCorrect = mode === "learn" && answered && isCorrect
          const showIncorrect = mode === "learn" && answered && isSelected && !isCorrect

          return (
            <button
              key={index}
              onClick={() => onSelectAnswer(index)}
              disabled={answered}
              className={`w-full p-4 rounded-lg text-left font-medium bg-neutral-900 transition-all duration-200 border-2 ${
                showCorrect
                  ? "bg-green-500/20 border-green-500 text-foreground"
                  : showIncorrect
                    ? "bg-red-500/20 border-red-500 text-foreground"
                    : isSelected
                      ? "bg-primary/20 border-primary text-foreground"
                      : "bg-card border-border text-foreground hover:border-primary/50 hover:bg-card/80"
              } ${answered ? "cursor-default" : "cursor-pointer"}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    showCorrect
                      ? "bg-green-500 border-green-500"
                      : showIncorrect
                        ? "bg-red-500 border-red-500"
                        : isSelected
                          ? "bg-primary border-primary"
                          : "border-muted-foreground"
                  }`}
                >
                  {showCorrect && <span className="text-white text-sm">✓</span>}
                  {showIncorrect && <span className="text-white text-sm">✗</span>}
                </div>
                <span>{option}</span>
              </div>
            </button>
          )
        })}
      </div>

    </div>
  )
}
