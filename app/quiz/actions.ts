"use server"
import { google } from "@ai-sdk/google"
import { generateObject } from "ai"
import { z } from "zod/v4"
import { db } from "@/lib/database"
import { quizzes } from "@/lib/database/quizSchema"
import {SYSTEM} from "./util"

export const saveQuiz = async (quizData: {
  title: string
  topic: string
  description: string
  questionCount: number
  data: any
}) => {
  try {
    await db.insert(quizzes).values(quizData)
    return { success: true }
  } catch (error) {
    console.error("Error saving quiz:", error)
    return { success: false, error: "Failed to save quiz" }
  }
}

export const getQuizzes = async () => {
  try {
    const allQuizzes = await db.select().from(quizzes)
    return allQuizzes
  } catch (error) {
    console.error("Error fetching quizzes:", error)
    return []
  }
}

export const generateQuiz = async (topic:string) => {
  const model = google("gemini-2.5-flash");
  const {object,finishReason,usage} = await generateObject({
    model: model,
    system: SYSTEM,
    prompt: topic.trim(),
    output: "object",
    schema: z.object({
  topic: z.string(),
  questions: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()),
      answer: z.string()
    })
  )
})
  })
  console.log(finishReason,usage)
  console.log(object);
  return object;
}
