"use server";
import { experimental_transcribe as transcribe, generateText } from 'ai';
import { groq } from '@ai-sdk/groq';

export async function sample(audio: Blob) {
    const result = await transcribe({
        model: groq.transcription('whisper-large-v3'),
        audio: await audio.arrayBuffer(),
        providerOptions: { groq: { language: 'en' } },
    });
    console.log(result)
    return result.text;
}

export async function generateResponse(prompt: string) {
    const { text } = await generateText({
        model: groq('groq/compound'),
        prompt: prompt,
    });
    return text;
}