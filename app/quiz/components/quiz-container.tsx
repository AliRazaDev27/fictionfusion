"use client"

import { useRef, useState } from "react"
import QuestionCard from "./question-card"
import ProgressBar from "./progress-bar"

interface Question {
  question: string
  options: string[]
  answer: string
}

const QUIZ_QUESTIONS : Question[] = [
  // Easy
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "Home Tool Markup Language",
      "Hyperlinks and Text Markup Language",
      "Hyper Transfer Markup Language"
    ],
    answer: "Hyper Text Markup Language"
  },
  {
    question: "Which HTML tag is used to define the largest heading?",
    options: ["<h6>", "<heading>", "<head>", "<h1>"],
    answer: "<h1>"
  },
//   {
//     question: "What is the correct HTML element for inserting a line break?",
//     options: ["<break>", "<br>", "<lb>", "<newline>"],
//     answer: "<br>"
//   },
//   {
//     question: "Which tag is used to create a hyperlink in HTML?",
//     options: ["<link>", "<a>", "<href>", "<url>"],
//     answer: "<a>"
//   },
//   {
//     question: "Which HTML tag is used to display an image?",
//     options: ["<img>", "<image>", "<picture>", "<src>"],
//     answer: "<img>"
//   },
//   {
//     question: "What attribute is used to specify the URL in an anchor tag?",
//     options: ["link", "href", "src", "url"],
//     answer: "href"
//   },
//   {
//     question: "Which tag is used for creating an unordered list?",
//     options: ["<ul>", "<ol>", "<list>", "<li>"],
//     answer: "<ul>"
//   },
//   {
//     question: "Which HTML element is used to display a numbered list?",
//     options: ["<ul>", "<ol>", "<li>", "<dl>"],
//     answer: "<ol>"
//   },
//   {
//     question: "What tag is used to create a table row?",
//     options: ["<tr>", "<td>", "<th>", "<table-row>"],
//     answer: "<tr>"
//   },
//   {
//     question: "What is the correct tag to make text bold in HTML?",
//     options: ["<strong>", "<bold>", "<b>", "<em>"],
//     answer: "<b>"
//   },

//   // Medium
//   {
//     question: "Which HTML tag is used to define an internal style sheet?",
//     options: ["<script>", "<style>", "<css>", "<design>"],
//     answer: "<style>"
//   },
//   {
//     question: "What does the <meta> tag in HTML provide?",
//     options: [
//       "Metadata about the HTML document",
//       "Links to external files",
//       "Defines styles",
//       "Displays media content"
//     ],
//     answer: "Metadata about the HTML document"
//   },
//   {
//     question: "Which attribute specifies an alternate text for an image?",
//     options: ["alt", "title", "src", "desc"],
//     answer: "alt"
//   },
//   {
//     question: "Which HTML element is used to define important text?",
//     options: ["<b>", "<i>", "<strong>", "<em>"],
//     answer: "<strong>"
//   },
//   {
//     question: "Which tag is used to embed a video in HTML5?",
//     options: ["<media>", "<video>", "<movie>", "<embed>"],
//     answer: "<video>"
//   },
//   {
//     question: "Which HTML element defines navigation links?",
//     options: ["<nav>", "<menu>", "<links>", "<navigate>"],
//     answer: "<nav>"
//   },
//   {
//     question: "What does the 'target' attribute do in an anchor tag?",
//     options: [
//       "Specifies where to open the linked document",
//       "Specifies the link color",
//       "Specifies the text alignment",
//       "Specifies the tooltip"
//     ],
//     answer: "Specifies where to open the linked document"
//   },
//   {
//     question: "Which element represents a self-contained content block in HTML5?",
//     options: ["<section>", "<article>", "<aside>", "<div>"],
//     answer: "<article>"
//   },
//   {
//     question: "Which tag is used to group footer content in HTML?",
//     options: ["<bottom>", "<footer>", "<end>", "<down>"],
//     answer: "<footer>"
//   },
//   {
//     question: "Which tag defines a form input field for text?",
//     options: [
//       "<input type='text'>",
//       "<textfield>",
//       "<form-input>",
//       "<text>"
//     ],
//     answer: "<input type='text'>"
//   },

//   // Hard
//   {
//     question: "What is the purpose of the <figure> and <figcaption> tags?",
//     options: [
//       "To group media content with a caption",
//       "To create tables with captions",
//       "To add animations",
//       "To define navigation menus"
//     ],
//     answer: "To group media content with a caption"
//   },
//   {
//     question: "Which HTML element defines a client-side image map?",
//     options: ["<map>", "<area>", "<canvas>", "<imgmap>"],
//     answer: "<map>"
//   },
//   {
//     question: "What is the default method attribute value for a form element?",
//     options: ["GET", "POST", "PUT", "DELETE"],
//     answer: "GET"
//   },
//   {
//     question: "Which HTML5 element is used for drawing graphics via scripting?",
//     options: ["<canvas>", "<svg>", "<draw>", "<graphics>"],
//     answer: "<canvas>"
//   },
//   {
//     question: "Which attribute in <iframe> prevents it from executing scripts?",
//     options: ["block", "disable", "sandbox", "noscript"],
//     answer: "sandbox"
//   },
//   {
//     question: "Which attribute can be used in HTML5 to validate input automatically?",
//     options: ["required", "validate", "check", "confirm"],
//     answer: "required"
//   },
//   {
//     question: "What is the purpose of the <data> tag?",
//     options: [
//       "To link data with machine-readable value",
//       "To store external API data",
//       "To create datasets",
//       "To define database connections"
//     ],
//     answer: "To link data with machine-readable value"
//   },
//   {
//     question: "Which tag is used to define preformatted text?",
//     options: ["<text>", "<code>", "<pre>", "<format>"],
//     answer: "<pre>"
//   },
//   {
//     question: "Which HTML attribute is used to specify that an input field must be filled out before submitting?",
//     options: ["mandatory", "validate", "required", "mustfill"],
//     answer: "required"
//   },
//   {
//     question: "What does the 'contenteditable' attribute do?",
//     options: [
//       "Makes the element's content editable",
//       "Locks the element from editing",
//       "Defines input type",
//       "Specifies content source"
//     ],
//     answer: "Makes the element's content editable"
//   }
];


// const _QUIZ_QUESTIONS: Question[] = [
//   {
//     question: "What is the capital of France?",
//     options: ["London", "Berlin", "Paris", "Madrid"],
//     answer: "Paris",
//   },
//   {
//     question: "Which planet is known as the Red Planet?",
//     options: ["Venus", "Mars", "Jupiter", "Saturn"],
//     answer: "Mars",
//   },
//   {
//     question: "What is the largest ocean on Earth?",
//     options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
//     answer: "Pacific Ocean",
//   },
//   {
//     question: 'Who wrote "Romeo and Juliet"?',
//     options: ["Jane Austen", "William Shakespeare", "Charles Dickens", "Mark Twain"],
//     answer: "William Shakespeare",
//   },
//   {
//     question: "What is the chemical symbol for Gold?",
//     options: ["Go", "Gd", "Au", "Ag"],
//     answer: "Au",
//   },
// ]

interface QuizContainerProps {
  onComplete: (score: number, total: number) => void
  mode: "learn" | "test"
}

export default function QuizContainer({ onComplete, mode }: QuizContainerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const isLastAnswerCorrect = useRef(false);
  console.log(score);

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
    <div className="min-h-[calc(100vh-70px)] bg-background flex flex-col p-3 md:p-6">
      <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col">
        <div className="mb-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Quiz Master</h1>
          <p className="text-muted-foreground">
            Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}
          </p>
        </div>

        {/* Progress Bar */}
        <ProgressBar current={currentQuestionIndex + 1} total={QUIZ_QUESTIONS.length} />

        {/* Question Card */}
        <div className="flex-1 flex items-center justify-center py-6">
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
          <div className="flex justify-end">
            <button
              onClick={handleNext}
              disabled={!answered}
              className="bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground font-semibold py-3 px-8 rounded-lg transition-all duration-200 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/20"
            >
              {isLastQuestion ? "Finish" : "Next"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
