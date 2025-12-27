"use server";
import { groq as groqProvider } from '@ai-sdk/groq';
import { generateText } from 'ai';
import Groq from "groq-sdk";


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

// Parse SRT content into individual subtitle blocks
function parseSRTBlocks(srtContent: string): string[] {
    // Split by double newlines (or more) to get individual subtitle blocks
    // Each block format: index\ntimestamp\ntext\n
    const blocks = srtContent.trim().split(/\n\n+/);
    return blocks.filter(block => block.trim().length > 0);
}

// Combine subtitle blocks back into SRT format
function combineSRTBlocks(blocks: string[]): string {
    return blocks.join('\n\n') + '\n';
}

// Translate a batch of subtitle blocks
async function translateBatch(batch: string[]): Promise<string[]> {
    const batchContent = batch.join('\n\n');

    const result = await generateText({
        model: groqProvider("moonshotai/kimi-k2-instruct-0905"),
        system:
            `You are a skilled turkish to english subtitle translator.
        Translate the turkish text to english.
        Don't translate names, characters, places, and proper nouns.
        Don't translate it one-to-one, translate it to make it sound natural in english.
        Don't change the original timestamps.
        Keep the exact same format (index number, timestamp, text).
        Output only the translated subtitles, nothing else.
        `,
        prompt: batchContent,
    });

    // Parse the translated result back into blocks
    return parseSRTBlocks(result.text);
}

export async function translateSubs(subs: string, batchSize: number = 50): Promise<string> {
    // Parse all subtitle blocks
    const allBlocks = parseSRTBlocks(subs);
    console.log(`Total subtitle blocks: ${allBlocks.length}`);

    // Process in batches
    const translatedBlocks: string[] = [];

    for (let i = 0; i < allBlocks.length; i += batchSize) {
        const batch = allBlocks.slice(i, i + batchSize);
        console.log(`Translating batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allBlocks.length / batchSize)} (${batch.length} blocks)`);

        const translatedBatch = await translateBatch(batch);
        translatedBlocks.push(...translatedBatch);
    }

    // Combine all translated blocks
    return combineSRTBlocks(translatedBlocks);
}