"use server";
// import { experimental_transcribe as transcribe } from 'ai';
// import { groq } from '@ai-sdk/groq';
import Groq from "groq-sdk";


// export async function getSubs(audio: Blob) {
//     console.log('starting call...')
//     const result = await transcribe({
//         model: groq.transcription('whisper-large-v3'),
//         audio: await audio.arrayBuffer(),
//         providerOptions: {
//             groq: {
//                 language: 'tr',
//                 timestampGranularities: ['segment'],
//             }
//         },
//     });
//     console.log(result)
//     return result.text;
// }

export async function getSubs(audio: File) {
    const groq = new Groq();
    // Create a transcription job
    const transcription = await groq.audio.transcriptions.create({
        file: audio, // Required path to audio file - replace with your audio file!
        model: "whisper-large-v3", // Required model to use for transcription
        // prompt: "Specify context or spelling", // Optional
        response_format: "verbose_json", // Optional
        timestamp_granularities: ["word", "segment"], // Optional (must set response_format to "json" to use and can specify "word", "segment" (default), or both)
        language: "tr", // Optional
        temperature: 0.0, // Optional
    });
    // To print only the transcription text, you'd use console.log(transcription.text); (here we're printing the entire transcription object to access timestamps)
    console.log(JSON.stringify(transcription, null, 2));
    return transcription.text;
}