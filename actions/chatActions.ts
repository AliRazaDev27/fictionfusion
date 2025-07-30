"use server"
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function sendMessage(message:string) {
    const model = google('gemini-2.5-flash');
    const { text } = await generateText({
      model,
      prompt: message,
    }); 
    return text
}