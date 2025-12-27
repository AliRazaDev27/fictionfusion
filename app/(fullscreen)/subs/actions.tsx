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
        model: "whisper-large-v3-turbo", // Required model to use for transcription
        // prompt: "Specify context or spelling", // Optional
        response_format: "verbose_json", // Optional
        timestamp_granularities: ["segment"], // Optional (must set response_format to "json" to use and can specify "word", "segment" (default), or both)
        language: "tr", // Optional
    });
    // To print only the transcription text, you'd use console.log(transcription.text); (here we're printing the entire transcription object to access timestamps)
    // console.log(JSON.stringify(transcription, null, 2));
    console.log(transcription?.text);
    return convertToSRT((transcription as any)?.segments);
}

function formatTimestamp(seconds) {
    const date = new Date(0);
    date.setMilliseconds(seconds * 1000);

    const isoString = date.toISOString().substr(11, 12);
    // ISO is HH:MM:SS.mmm, SRT needs HH:MM:SS,mmm (comma)
    return isoString.replace('.', ',');
}

function convertToSRT(segments) {
    return segments.map((segment, index) => {
        const start = formatTimestamp(segment.start);
        const end = formatTimestamp(segment.end);
        const text = segment.text.trim();

        return `${index + 1}\n${start} --> ${end}\n${text}\n`;
    }).join('\n');
}