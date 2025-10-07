"use server"
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';


export async function sendMessage(message:string) {
    const model = google('gemini-2.0-flash');
    const start = performance.now();
    const { text,usage,totalUsage } = await generateText({
      model:model,
      prompt: message,
      tools: {
        // google_search: google.tools.googleSearch({}),
        // url_context: google.tools.urlContext({}),
      },
      providerOptions: {
        google:{
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_NONE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_NONE'
            },
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_NONE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_NONE'
            },
          ],
        },
      }
    }); 
    console.log("response time in server action", (performance.now() - start) / 1000);
    console.log(usage,totalUsage)
    return text
}