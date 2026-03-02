"use server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface GroqModel {
    id: string;
    object: string;
    created: number;
    owned_by: string;
    active?: boolean;
    context_window?: number;
    max_completion_tokens?: number;
}
export const getModels = async () => {
    const models = await groq.models.list();
    return models.data as GroqModel[];
};
