"use server"
import { google } from "@ai-sdk/google"
import { generateObject, NoObjectGeneratedError } from "ai"
import { db } from "@/lib/database"
import { quizzes } from "@/lib/database/quizSchema"
import { eq } from "drizzle-orm"
import {SCHEMA_QUIZ_AI, STRICT_SYSTEM, SYSTEM} from "./util"
import { cacheTag } from 'next/cache'
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
    const session = await auth();
    if(session?.user?.role !== "ADMIN") throw new Error("Not Authorized")
    await db.insert(quizzes).values(quizData)
    revalidateTag('quiz-public')
    return { success: true }
  } catch (error:any) {
    console.error("Error saving quiz:", error)
    return { success: false, error:  error?.message ||"Failed to save quiz" }
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
    const session = await auth();
    if(session?.user?.role !== "ADMIN") throw new Error("Not Authorized")
    await db.update(quizzes).set(updatedFields).where(eq(quizzes.id, id))
    return { success: true }
  } catch (error:any) {
    console.error("Error updating quiz:", error)
    return { success: false, error: error?.message||"Failed to update quiz" }
  }
}

export const generateQuiz = async (topic:string, modelName: string) => {
try{
  const session = await auth();
  if(session?.user?.role !== "ADMIN") modelName = "gemini-2.5-flash-lite";
  const selectedModelConfig = models.find(m => m.model === modelName);
  console.log(selectedModelConfig)
  const model = google(selectedModelConfig?.model || "gemini-2.5-flash"); // Fallback to default if not found
  const {object,finishReason,usage} = await generateObject({
    model: model,
    system: STRICT_SYSTEM,
    prompt: topic.trim(),
    output: "object",
    schema: SCHEMA_QUIZ_AI,
  })
  console.log(finishReason,usage)
  console.log(object);
  return {success:true,data:object,error:null};
}
catch(error:any){
  console.log(error);
  if(NoObjectGeneratedError.isInstance(error)){
    console.log('NoObjectGeneratedError');
    console.log('Cause:', error.cause);
    console.log('Text:', error.text);
    console.log('Response:', error.response);
    console.log('Usage:', error.usage);
    console.log('Finish Reason:', error.finishReason);
  }
  return {success:false,data:null,error:error?.message || error?.cause ||"Failed to generate quiz"}
}
}
