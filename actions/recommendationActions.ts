"use server"
import { groq } from '@ai-sdk/groq';
import { generateObject } from 'ai';
import { auth } from '@/auth';
import { z } from 'zod';
import { systems } from '@/lib/ai';

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
        if (!session?.user) throw new Error("Not Authorized");
        const prompt = `User Preference/Query: "${query}"\nCategory Focus: ${category}`;
        const { object } = await generateObject({
            model: groq(model),
            system: systems.recommendation,
            prompt: prompt,
            schema: recommendationSchema,
        });

        return { success: true, data: object.recommendations };
    } catch (error: any) {
        console.error("Recommendation Error:", error);
        return { success: false, message: error.message };
    }
}
