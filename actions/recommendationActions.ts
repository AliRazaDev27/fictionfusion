"use server"
import { google } from '@ai-sdk/google';
import { groq } from '@ai-sdk/groq';
import { generateObject } from 'ai';
import { auth } from '@/auth';
import { z } from 'zod';
import { safetySettings, systems } from '@/lib/ai';

const recommendationSchema = z.object({
    recommendations: z.array(z.object({
        title: z.string().describe("The full correct title of the recommendation"),
        type: z.string().describe("The type of media (Movie, Show, Book, Game, Anime, etc.)"),
        description: z.string().describe("A brief, engaging summary (1-2 sentences)"),
        whyOnlyYou: z.string().describe("A specific reason why this matches the USER'S input"),
        score: z.number().describe("A compatibility score from 0 to 100"),
    }))
});



export async function getRecommendations(query: string, category: string = "All", model: string = "openai/gpt-oss-20b") {
    try {
        const session = await auth();
        // Assuming we want to allow logged in users, or maybe just ADMIN as per chatActions? 
        // The plan didn't specify strict ADMIN only, but chatActions did. 
        // I'll relax it to just authenticated for now, or follow chatActions if strict.
        // Let's stick to auth() check. If chatActions restricts to ADMIN, maybe I should too?
        // User request "AI based recommendation generator... I'm using vercel ai sdk"
        // I will check if session exists.
        if (!session?.user) throw new Error("Not Authorized");

        const prompt = `User Preference/Query: "${query}"\nCategory Focus: ${category}`;

        const { object } = await generateObject({
            // model: google('gemini-2.5-flash-lite'), // Using 2.0 Flash as it's fast and good for this
            model: groq(model),
            system: systems.recommendation,
            prompt: prompt,
            schema: recommendationSchema,
            temperature: 0.7, // Slightly creative but focused
        });

        return { success: true, data: object.recommendations };
    } catch (error: any) {
        console.error("Recommendation Error:", error);
        return { success: false, message: error.message };
    }
}
