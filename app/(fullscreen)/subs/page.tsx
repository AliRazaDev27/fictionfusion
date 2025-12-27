"use client";
import { useRef, useState } from "react";
import { processMultipleAudioFiles, ProcessingResult } from "./actions";

// Sort files by their suffix index (_000, _001, etc.) - runs client-side
function extractFileIndex(filename: string): number {
    const match = filename.match(/_(\d+)\.[^.]+$/);
    if (match) {
        return parseInt(match[1], 10);
    }
    const fallbackMatch = filename.match(/(\d+)\.[^.]+$/);
    if (fallbackMatch) {
        return parseInt(fallbackMatch[1], 10);
    }
    return 0;
}

function sortFilesByIndex(files: File[]): File[] {
    return [...files].sort((a, b) => {
        const indexA = extractFileIndex(a.name);
        const indexB = extractFileIndex(b.name);
        return indexA - indexB;
    });
}

type ProcessingStatus =
    | "idle"
    | "sorting"
    | "transcribing"
    | "translating"
    | "complete"
    | "error";

export default function SubtitlePage() {
    const fileRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [status, setStatus] = useState<ProcessingStatus>("idle");
    const [statusMessage, setStatusMessage] = useState<string>("");
    const [result, setResult] = useState<ProcessingResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        // Sort files by index for display
        const sorted = sortFilesByIndex(selectedFiles);
        setFiles(sorted);
        setResult(null);
        setError(null);
        setStatus("idle");
    };

    const handleProcess = async () => {
        if (files.length === 0) return;

        try {
            setError(null);
            setResult(null);

            setStatus("sorting");
            setStatusMessage("Sorting files by order...");

            // Small delay to show sorting status
            await new Promise(resolve => setTimeout(resolve, 300));

            setStatus("transcribing");
            setStatusMessage(`Transcribing ${files.length} audio files...`);

            // Process all files
            const processingResult = await processMultipleAudioFiles(files);

            setStatus("complete");
            setStatusMessage("Processing complete!");
            setResult(processingResult);
        } catch (err) {
            setStatus("error");
            setError(err instanceof Error ? err.message : "An error occurred");
            console.error(err);
        }
    };

    const downloadFile = (content: string, filename: string) => {
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-2">
                    Subtitle Generator
                </h1>
                <p className="text-gray-400 mb-8">
                    Upload audio files to generate Turkish subtitles and translate to English
                </p>

                {/* File Input Section */}
                <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                        Select Audio Files
                    </label>
                    <input
                        ref={fileRef}
                        type="file"
                        accept="audio/*"
                        multiple
                        onChange={handleFileChange}
                        className="block w-full text-gray-300 file:mr-4 file:py-2 file:px-4 
                                   file:rounded-lg file:border-0 file:bg-blue-600 file:text-white 
                                   file:cursor-pointer hover:file:bg-blue-700 file:transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        Files should be named with suffix like _000, _001, _002 for proper ordering
                    </p>
                </div>

                {/* File List */}
                {files.length > 0 && (
                    <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 mb-6">
                        <h2 className="text-lg font-semibold text-white mb-3">
                            Selected Files ({files.length})
                        </h2>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {files.map((file, index) => (
                                <div
                                    key={file.name}
                                    className="flex items-center gap-3 text-gray-300 bg-gray-700/30 rounded-lg px-4 py-2"
                                >
                                    <span className="text-blue-400 font-mono text-sm w-8">
                                        #{index + 1}
                                    </span>
                                    <span className="truncate">{file.name}</span>
                                    <span className="text-gray-500 text-sm ml-auto">
                                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Process Button */}
                <button
                    onClick={handleProcess}
                    disabled={files.length === 0 || (status !== "idle" && status !== "complete" && status !== "error")}
                    className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 
                               text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 
                               transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6"
                >
                    {status === "idle" ? "Start Processing" :
                        status === "complete" ? "Process Again" :
                            status === "error" ? "Retry" :
                                "Processing..."}
                </button>

                {/* Status Display */}
                {status !== "idle" && (
                    <div className={`rounded-xl p-4 mb-6 ${status === "error"
                        ? "bg-red-900/30 border border-red-700"
                        : status === "complete"
                            ? "bg-green-900/30 border border-green-700"
                            : "bg-blue-900/30 border border-blue-700"
                        }`}>
                        <div className="flex items-center gap-3">
                            {status !== "error" && status !== "complete" && (
                                <div className="animate-spin w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full" />
                            )}
                            {status === "complete" && (
                                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                            {status === "error" && (
                                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                            <span className={`${status === "error" ? "text-red-300" :
                                status === "complete" ? "text-green-300" :
                                    "text-blue-300"
                                }`}>
                                {error || statusMessage}
                            </span>
                        </div>
                    </div>
                )}

                {/* Download Buttons */}
                {result && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <button
                            onClick={() => downloadFile(result.turkishSRT, "subtitle_tr.srt")}
                            className="py-4 px-6 bg-gray-700 hover:bg-gray-600 text-white 
                                       font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download Turkish SRT
                        </button>
                        <button
                            onClick={() => downloadFile(result.englishSRT, "subtitle_en.srt")}
                            className="py-4 px-6 bg-gradient-to-r from-green-600 to-teal-600 
                                       hover:from-green-700 hover:to-teal-700 text-white 
                                       font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download English SRT
                        </button>
                    </div>
                )}

                {/* Preview Section */}
                {result && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
                            <h2 className="text-lg font-semibold text-white mb-3">
                                Turkish Subtitles Preview
                            </h2>
                            <pre className="text-gray-300 text-sm font-mono overflow-auto max-h-96 
                                           bg-gray-900/50 rounded-lg p-4 whitespace-pre-wrap">
                                {result.turkishSRT.slice(0, 2000)}
                                {result.turkishSRT.length > 2000 && "\n\n... (truncated)"}
                            </pre>
                        </div>
                        <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6">
                            <h2 className="text-lg font-semibold text-white mb-3">
                                English Subtitles Preview
                            </h2>
                            <pre className="text-gray-300 text-sm font-mono overflow-auto max-h-96 
                                           bg-gray-900/50 rounded-lg p-4 whitespace-pre-wrap">
                                {result.englishSRT.slice(0, 2000)}
                                {result.englishSRT.length > 2000 && "\n\n... (truncated)"}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}