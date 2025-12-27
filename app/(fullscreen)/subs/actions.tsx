"use server";
import { groq as groqProvider } from '@ai-sdk/groq';
import { generateText } from 'ai';
import Groq from "groq-sdk";

// Result type for progress tracking
export type ProcessingResult = {
    turkishSRT: string;
    englishSRT: string;
};

// Sort files by their suffix index (_000, _001, etc.)
function sortFilesByIndex(files: File[]): File[] {
    return [...files].sort((a, b) => {
        const indexA = extractFileIndex(a.name);
        const indexB = extractFileIndex(b.name);
        return indexA - indexB;
    });
}

// Extract numeric index from filename (e.g., "filename_001.mp3" -> 1)
function extractFileIndex(filename: string): number {
    const match = filename.match(/_(\d+)\.[^.]+$/);
    if (match) {
        return parseInt(match[1], 10);
    }
    // If no index found, try to find any number sequence before extension
    const fallbackMatch = filename.match(/(\d+)\.[^.]+$/);
    if (fallbackMatch) {
        return parseInt(fallbackMatch[1], 10);
    }
    return 0;
}

// Transcribe audio and return segments with duration info
async function transcribeAudio(audio: File): Promise<{ srt: string; duration: number }> {
    const groq = new Groq();
    const transcription = await groq.audio.transcriptions.create({
        file: audio,
        model: "whisper-large-v3-turbo",
        response_format: "verbose_json",
        timestamp_granularities: ["segment"],
        language: "tr",
    });

    const segments = (transcription as any)?.segments || [];
    const srt = convertToSRT(segments);

    // Get duration from last segment's end time, or 0 if no segments
    const duration = segments.length > 0
        ? segments[segments.length - 1].end
        : (transcription as any)?.duration || 0;

    console.log(`Transcribed: ${audio.name}, Duration: ${duration}s, Segments: ${segments.length}`);
    return { srt, duration };
}

export async function getSubs(audio: File) {
    const result = await transcribeAudio(audio);
    return result.srt;
}

function formatTimestamp(seconds: number): string {
    const date = new Date(0);
    date.setMilliseconds(seconds * 1000);
    const isoString = date.toISOString().substr(11, 12);
    return isoString.replace('.', ',');
}

// Parse SRT timestamp back to seconds
function parseTimestamp(timestamp: string): number {
    // Format: HH:MM:SS,mmm
    const [time, ms] = timestamp.split(',');
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds + parseInt(ms) / 1000;
}

function convertToSRT(segments: any[]): string {
    return segments.map((segment, index) => {
        const start = formatTimestamp(segment.start);
        const end = formatTimestamp(segment.end);
        const text = segment.text.trim();
        return `${index + 1}\n${start} --> ${end}\n${text}\n`;
    }).join('\n');
}

// Offset all timestamps in an SRT by a given number of seconds
function offsetSRT(srt: string, offsetSeconds: number): string {
    if (offsetSeconds === 0) return srt;

    const blocks = parseSRTBlocks(srt);
    return blocks.map(block => {
        const lines = block.split('\n');
        if (lines.length >= 2) {
            // Parse and offset the timestamp line
            const timestampLine = lines[1];
            const match = timestampLine.match(/(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/);
            if (match) {
                const startSeconds = parseTimestamp(match[1]) + offsetSeconds;
                const endSeconds = parseTimestamp(match[2]) + offsetSeconds;
                lines[1] = `${formatTimestamp(startSeconds)} --> ${formatTimestamp(endSeconds)}`;
            }
        }
        return lines.join('\n');
    }).join('\n\n');
}

// Combine multiple SRT strings with proper indexing
function combineSRTs(srtArray: string[]): string {
    let combinedBlocks: string[] = [];
    let currentIndex = 1;

    for (const srt of srtArray) {
        const blocks = parseSRTBlocks(srt);
        for (const block of blocks) {
            const lines = block.split('\n');
            if (lines.length >= 1) {
                // Replace the index with sequential numbering
                lines[0] = String(currentIndex);
                currentIndex++;
            }
            combinedBlocks.push(lines.join('\n'));
        }
    }

    return combinedBlocks.join('\n\n') + '\n';
}

// Parse SRT content into individual subtitle blocks
function parseSRTBlocks(srtContent: string): string[] {
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

    return parseSRTBlocks(result.text);
}

export async function translateSubs(subs: string, batchSize: number = 50): Promise<string> {
    const allBlocks = parseSRTBlocks(subs);
    console.log(`Total subtitle blocks: ${allBlocks.length}`);

    const translatedBlocks: string[] = [];

    for (let i = 0; i < allBlocks.length; i += batchSize) {
        const batch = allBlocks.slice(i, i + batchSize);
        console.log(`Translating batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allBlocks.length / batchSize)} (${batch.length} blocks)`);

        const translatedBatch = await translateBatch(batch);
        translatedBlocks.push(...translatedBatch);
    }

    return combineSRTBlocks(translatedBlocks);
}

// Main workflow: process multiple audio files into Turkish and English subtitles
export async function processMultipleAudioFiles(files: File[]): Promise<ProcessingResult> {
    console.log(`Processing ${files.length} audio files...`);

    // 1. Sort files by index
    const sortedFiles = sortFilesByIndex(files);
    console.log('Sorted file order:', sortedFiles.map(f => f.name).join(', '));

    // 2. Transcribe each file and collect results with offsets
    const srtResults: string[] = [];
    let cumulativeOffset = 0;

    for (let i = 0; i < sortedFiles.length; i++) {
        const file = sortedFiles[i];
        console.log(`[${i + 1}/${sortedFiles.length}] Transcribing: ${file.name}`);

        const { srt, duration } = await transcribeAudio(file);

        // Apply offset to this SRT
        const offsettedSRT = offsetSRT(srt, cumulativeOffset);
        srtResults.push(offsettedSRT);

        // Update cumulative offset for next file
        cumulativeOffset += duration;
        console.log(`Cumulative offset after ${file.name}: ${cumulativeOffset}s`);
    }

    // 3. Combine all SRTs with proper indexing
    const turkishSRT = combineSRTs(srtResults);
    console.log('Combined Turkish SRT generated');

    // 4. Translate to English
    console.log('Starting translation...');
    const englishSRT = await translateSubs(turkishSRT);
    console.log('English SRT generated');

    return { turkishSRT, englishSRT };
}