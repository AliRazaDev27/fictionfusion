"use server"
import { google } from "@ai-sdk/google"
import { generateObject } from "ai"
import { z } from "zod/v4"
import { db } from "@/lib/database"
import { quizzes } from "@/lib/database/quizSchema"
import { eq, sql } from "drizzle-orm"
import {SYSTEM} from "./util"
import { unstable_cacheTag as cacheTag } from 'next/cache'
import { revalidateTag } from 'next/cache'
import { models } from "@/lib/ai"
import { auth } from "@/auth"
export const getQuizById = async (id: number) => {
  try {
    const quiz = await db.select().from(quizzes).where(eq(quizzes.id, id))
    return quiz[0]
  } catch (error) {
    console.error("Error fetching quiz by id:", error)
    return null
  }
}

export const saveQuiz = async (quizData: {
  title: string
  topic: string
  description: string
  questionCount: number
  data: any
}) => {
  try {
    await db.insert(quizzes).values(quizData)
    revalidateTag('quiz-public')
    return { success: true }
  } catch (error) {
    console.error("Error saving quiz:", error)
    return { success: false, error: "Failed to save quiz" }
  }
}

export const getQuizzes = async () => {
  "use cache";
  cacheTag('quiz-public');
  try {
    const allQuizzes = await db.select().from(quizzes)
    return allQuizzes
  } catch (error) {
    console.error("Error fetching quizzes:", error)
    return []
  }
}

export const updateQuiz = async (
  id: number,
  updatedFields: {
    title?: string
    topic?: string
    description?: string | null
    questionCount?: number
  }
) => {
  try {
    await db.update(quizzes).set(updatedFields).where(eq(quizzes.id, id))
    return { success: true }
  } catch (error) {
    console.error("Error updating quiz:", error)
    return { success: false, error: "Failed to update quiz" }
  }
}

export const generateQuiz = async (topic:string, modelName: string) => {
  const session = await auth();
  if(session?.user?.role !== "ADMIN") modelName = "gemini-2.5-flash-lite";
  const selectedModelConfig = models.find(m => m.model === modelName);
  console.log(selectedModelConfig)
  const model = google(selectedModelConfig?.model || "gemini-2.5-flash"); // Fallback to default if not found
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
