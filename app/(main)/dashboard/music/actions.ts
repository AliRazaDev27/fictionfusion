"use server";
import Groq from "groq-sdk";
export async function generateSubs(url:string) {
  console.log(url);
if(url){
    const groq = new Groq();
    const result = await groq.audio.transcriptions.create({
      model: "whisper-large-v3",
      url: url,
      language: "tr",
      timestamp_granularities: ["segment"],
      response_format: "verbose_json",
    })
    console.log(result);
  return result.text;
}
return "error";
}