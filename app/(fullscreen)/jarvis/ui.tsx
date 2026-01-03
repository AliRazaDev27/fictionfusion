'use client';

import { useState, useRef, useEffect } from 'react';
import { sample, generateResponse } from './actions';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Square, X, Loader2, Sparkles, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const useAudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // value mimeTypes in order of preference
            const mimeType = [
                'audio/webm;codecs=opus',
                'audio/webm',
                'audio/mp4',
                'audio/ogg',
                ''
            ].find(type => type === '' || MediaRecorder.isTypeSupported(type)) || '';

            const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) chunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: mimeType || 'audio/webm' });
                if (blob.size > 0) {
                    setAudioBlob(blob);
                }
                stream.getTracks().forEach((track) => track.stop());
            };

            // Request data every 200ms to ensure we have chunks
            mediaRecorder.start(200);
            setIsRecording(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    return { isRecording, audioBlob, startRecording, stopRecording, setAudioBlob };
};

export default function JarvisInterface() {
    const { isRecording, audioBlob, startRecording, stopRecording, setAudioBlob } = useAudioRecorder();
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcript, setTranscript] = useState<string>("");
    const [response, setResponse] = useState<string>("");
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState<string>("");

    useEffect(() => {
        if (audioBlob) {
            handleProcess(audioBlob);
        }
    }, [audioBlob]);

    const handleProcess = async (blob: Blob) => {
        setIsProcessing(true);
        setIsOpen(true);
        setTranscript("");
        setResponse("");

        try {
            // 1. Transcribe
            const text = await sample(blob);
            setTranscript(text);

            if (text && text.trim().length > 0) {
                // 2. Generate Response
                const aiResponse = await generateResponse(text);
                setResponse(aiResponse);
            } else {
                setResponse("I didn't catch that. Please try again.");
            }
        } catch (e) {
            setResponse("Error processing request.");
        } finally {
            setIsProcessing(false);
            setAudioBlob(null);
        }
    };

    const handleTextSubmit = async () => {
        if (!inputValue.trim() || isProcessing) return;

        const userMessage = inputValue.trim();
        setInputValue("");
        setTranscript(userMessage);
        setResponse("");
        setIsProcessing(true);

        try {
            const aiResponse = await generateResponse(userMessage);
            setResponse(aiResponse);
        } catch (e) {
            setResponse("Error processing request.");
        } finally {
            setIsProcessing(false);
        }
    };

    // Keyboard shortcut: Alt+Space to hold-to-record
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Backquote') {
                if (!isRecording && !isProcessing) {
                    e.preventDefault();
                    startRecording();
                }
                else if (isRecording) {
                    e.preventDefault();
                    stopRecording();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isRecording, isProcessing, startRecording, stopRecording]);

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
            // Optional: Close dialog when starting new recording?
            // setIsOpen(false); 
        }
    };

    return (
        <div className="fixed inset-0 pointer-events-none z-50">
            {/* Detached Dialog Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="fixed inset-0 flex items-center justify-center p-4 pointer-events-auto bg-black/20 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    >
                        <div
                            className="w-full max-w-3xl max-h-[80vh] overflow-hidden bg-[#0a0a0a] border border-cyan-500/20 rounded-2xl shadow-[0_0_40px_rgba(0,255,255,0.1)] flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
                                <div className="flex items-center gap-2 text-cyan-400">
                                    <Sparkles className="w-4 h-4" />
                                    <span className="text-sm font-medium tracking-widest uppercase">Jarvis AI</span>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {/* User Transcript */}
                                {transcript && (
                                    <div className="flex justify-end">
                                        <div className="bg-white/10 text-white/80 px-4 py-2 rounded-2xl rounded-tr-sm max-w-[80%]">
                                            <p className="text-sm">{transcript}</p>
                                        </div>
                                    </div>
                                )}

                                {/* AI Response */}
                                <div className="flex justify-start">
                                    <div className="space-y-2 max-w-[90%]">
                                        {isProcessing && !response ? (
                                            <div className="flex items-center gap-2 text-cyan-500/50">
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span className="text-xs tracking-wider">PROCESSING...</span>
                                            </div>
                                        ) : (
                                            <div className="prose prose-invert prose-cyan max-w-none text-white/90 leading-relaxed">
                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                    {response}
                                                </ReactMarkdown>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Input Field */}
                            <div className="p-4 border-t border-white/5 bg-white/5">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
                                        placeholder="Type a message..."
                                        disabled={isProcessing}
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50 transition-colors disabled:opacity-50"
                                    />
                                    <button
                                        onClick={handleTextSubmit}
                                        disabled={isProcessing || !inputValue.trim()}
                                        className="p-2 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-xl hover:bg-cyan-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sticky Button */}
            <div className="fixed bottom-6 left-6 pointer-events-auto">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleRecording}
                    className={`
                        relative group flex items-center justify-center w-14 h-14 rounded-full 
                        backdrop-blur-md border transition-all duration-300 shadow-lg overflow-hidden
                        ${isRecording
                            ? 'bg-red-500/20 border-red-500 shadow-[0_0_20px_rgba(255,0,0,0.4)]'
                            : 'bg-black/80 border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)]'
                        }
                    `}
                >
                    {/* Ripple/Glow effect when recording */}
                    {isRecording && (
                        <span className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                    )}

                    <div className={`relative z-10 transition-colors ${isRecording ? 'text-red-500' : 'text-cyan-400'}`}>
                        {isRecording ? (
                            <Square className="w-5 h-5 fill-current" />
                        ) : (
                            <Mic className="w-6 h-6" />
                        )}
                    </div>
                </motion.button>
            </div>
        </div>
    );
}