"use server";
import { generateText } from 'ai';
import { groq } from '@ai-sdk/groq';

export default async function getWorksFromLLM(title:string){
  try{
    const { text, usage } = await generateText({
      model: groq('openai/gpt-oss-120b'), 
      system: `You are an expert media database, Given the name of an actor/actress in the prompt, return a list of their works, only the titles.
      }`,
      prompt: title,
      temperature: 0.3, // Low temp for factual summary
    });
    console.log(text, usage);
    return text;
  }
  catch(e){
    console.log(e)
  }
}