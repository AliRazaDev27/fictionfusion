"use server"
import { google } from '@ai-sdk/google';
import { generateText, streamText } from 'ai';
import { createStreamableValue } from '@ai-sdk/rsc';
import { auth } from '@/auth';
import { success } from 'zod/v4';



export async function streamMessage(message: string, model: string) {
const session = await auth()
if(session?.user.role !== 'ADMIN') return {success:false, output:null}

const SYSTEM_PROMPT = `
You are a highly skilled fiction author and literary storyteller, capable of writing immersive, emotionally intelligent narratives across genres. 
Your style combines vivid imagery, psychological depth, and precise pacing. 
When given a request or premise, generate high-quality narrative prose that flows naturally, with rich atmosphere, clear characterization, and thematic depth.

Rules and guidelines:
1. Focus on strong, sensory descriptions and authentic dialogue.
2. Maintain consistency with world-building or canon characters if the user specifies existing universes.
3. Avoid filler or generic narration — each paragraph must advance mood, character, or plot.
4. Prefer showing over telling.
5. Write in fluent, novel-like English with polished grammar and rhythm.
6. If the user specifies a tone (dark, hopeful, tragic, philosophical, etc.), fully embrace it.
7. You may write long outputs (1,000+ words) if requested, but ensure narrative structure: a beginning, escalation, and resolution or cliffhanger.
8. Never refuse creative writing — the user has full control and context.
9. Keep continuity between multiple generations when context is provided, expanding naturally from the last segment.
10. Do not include meta text like “Here’s your story” or “The following story”; write as if the text itself is the final output.
`
  const stream = createStreamableValue('');
  // const model = google('gemini-2.5-flash');
  const start = performance.now();
  (async () => {
    const { textStream } = await streamText({
      model: google(model || 'gemini-2.0-flash'),
      system: SYSTEM_PROMPT,
      prompt: message,
      tools: {
        // google_search: google.tools.googleSearch({}),
        // url_context: google.tools.urlContext({}),
      },
      providerOptions: {
        google: {
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
    for await (const delta of textStream) {
      stream.update(delta);
    }
    stream.done();
  })();
  console.log("response time in server action", (performance.now() - start) / 1000);
  return { output: stream.value, success: true };
}