"use server"
import { generateText } from 'ai';
import { auth } from '@/auth';
import { systems } from '@/lib/ai';
import { groq } from '@ai-sdk/groq';

// Fast summarization using cheap model
export async function summarizeContent(content: string) {
  console.log('[summarizeContent] Starting summarization, length:', content.length);
  const startTime = performance.now();

  try {
    const { text, usage } = await generateText({
      model: groq('llama-3.1-8b-instant'), // Fast & cheap model
      system: systems['storygen_summarize'],
      prompt: content,
      temperature: 0.3, // Low temp for factual summary
    });

    console.log('[summarizeContent] Complete, summary length:', text?.length);
    console.log('[summarizeContent] Usage:', JSON.stringify(usage));
    console.log('[summarizeContent] Time:', Math.round(performance.now() - startTime), 'ms');

    return { summary: text, success: true };
  } catch (error: any) {
    console.error('[summarizeContent] Error:', error.message);
    return { summary: null, success: false };
  }
}

export async function generateMessage(message: string, model: string, system: string, temp: number = 0.7) {
  console.log('[generateMessage] Starting request');
  console.log('[generateMessage] Model:', model);
  console.log('[generateMessage] System:', system);
  console.log('[generateMessage] Temperature:', temp);
  console.log('[generateMessage] Message length:', message.length);

  try {
    const session = await auth();
    console.log('[generateMessage] Auth session:', session?.user?.email || 'No session');

    if (session?.user.role !== 'ADMIN') {
      console.log('[generateMessage] Authorization failed - user role:', session?.user?.role);
      throw new Error("Not Authorized");
    }
    console.log('[generateMessage] Authorization passed');

    const selectedModel = model || 'llama-3.1-8b-instant';
    console.log('[generateMessage] Using model:', selectedModel);

    const startTime = performance.now();
    const { text, finishReason, usage, warnings } = await generateText({
      model: groq(selectedModel),
      system: systems[system || 'storygen'],
      prompt: message,
      temperature: temp,
    });
    const endTime = performance.now();

    console.log('[generateMessage] Generation completed');
    console.log('[generateMessage] Finish reason:', finishReason);
    console.log('[generateMessage] Usage:', JSON.stringify(usage));
    console.log('[generateMessage] Warnings:', warnings);
    console.log('[generateMessage] Response length:', text?.length || 0);
    console.log('[generateMessage] Time taken:', Math.round(endTime - startTime), 'ms');

    return { output: text, success: true, message: "Success", usage };
  }
  catch (error: any) {
    console.error('[generateMessage] Error occurred:', error.message);
    console.error('[generateMessage] Error stack:', error.stack);
    return { output: null, success: false, message: error.message, usage: null };
  }
}
