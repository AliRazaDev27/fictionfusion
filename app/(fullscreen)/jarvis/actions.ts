"use server";
import { experimental_transcribe as transcribe, generateText } from 'ai';
import { groq } from '@ai-sdk/groq';
import { GoogleGenAI } from "@google/genai";
import { db } from '@/lib/database';
import { memories } from "./memorySchema";
import { desc, sql } from "drizzle-orm";

export async function generateEmbedding(text: string) {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY! });
        const response = await ai.models.embedContent({
            model: 'gemini-embedding-001',
            contents: text,
        });
        console.log(response.embeddings);
        return null;
    }
    catch (e) {
        console.log(e);
        return null;
    }
}

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

export async function jarvisQuery(userPrompt: string) {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY! });
        const result = await ai.models.embedContent({
            model: 'gemini-embedding-001',
            contents: userPrompt,
        });
        const vector = result.embeddings?.[0].values;

        // 2. Perform Similarity Search in PostgreSQL
        // We calculate 1 - cosine_distance to get a similarity score
        const contextMemories = await db
            .select({
                content: memories.content,
                similarity: sql<number>`1 - (${memories.embedding} <=> ${JSON.stringify(vector)})`,
            })
            .from(memories)
            .orderBy((t) => desc(t.similarity))
            .limit(5);

        const contextString = contextMemories
            .map((m) => `- ${m.content}`)
            .join("\n");
        const prompt = `Context: \n${contextString}\n\nUser Prompt: ${userPrompt}`;
        const response = await generateResponse(prompt);
        return response;
    }
    catch (e) {
        console.log(e);
        return null;
    }
}