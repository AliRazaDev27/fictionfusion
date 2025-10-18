"use server"
import { google } from "@ai-sdk/google"
import { generateObject } from "ai"
import { z } from "zod/v4"

export const data = async () => {
  "use server"
  const model = google("gemini-2.5-pro");
  const {object,finishReason,usage} = await generateObject({
    model: model,
    system: `You are a html,css and js expert`,
    prompt: "Generate 10 hard difficulty html Quiz",
    output: "array",
    schema: z.array(
      z.object({
        question: z.string(),
        options: z.array(z.string()),
        answer: z.string()
      })
    )
  })
  console.log(finishReason,usage)
  return object;
}