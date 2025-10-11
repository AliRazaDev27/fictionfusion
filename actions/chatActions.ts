"use server"
import { google } from '@ai-sdk/google';
import { generateText, streamText } from 'ai';
import { createStreamableValue } from '@ai-sdk/rsc';
import { auth } from '@/auth';
import { success } from 'zod/v4';
import { safetySettings, systems, tools } from '@/lib/ai';



export async function generateMessage(message: string, model: string, system: string, temp: number = 0.5) {
  console.log(`model: ${model}`)
  const session = await auth()
  if (session?.user.role !== 'ADMIN') return { success: false, output: null }

  const { text } = await generateText({
    model: google(model || 'gemini-2.0-flash'),
    system: systems[system || 'storygen'],
    prompt: message,
    temperature: temp,
    // tools: tools[model],
    providerOptions: {
      google: {
        safetySettings: safetySettings
      },
    }
  });
  return { output: text, success: true };
}

export async function streamMessage(message: string, model: string) {
  console.log(`model: ${model}`)
  const session = await auth()
  if (session?.user.role !== 'ADMIN') return { success: false, output: null }

  const stream = createStreamableValue('');
  (async () => {
    const { textStream } = await streamText({
      model: google(model || 'gemini-2.0-flash'),
      system: systems.storygen,
      prompt: message,
      tools: tools[model],
      providerOptions: {
        google: {
          safetySettings: safetySettings
        },
      }
    });
    for await (const delta of textStream) {
      stream.update(delta);
    }
    stream.done();
  })();
  return { output: stream.value, success: true };
}
