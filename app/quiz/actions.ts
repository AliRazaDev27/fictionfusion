"use server"
import { google } from "@ai-sdk/google"
import { generateObject } from "ai"
import { z } from "zod/v4"
import {SYSTEM} from "./util"

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