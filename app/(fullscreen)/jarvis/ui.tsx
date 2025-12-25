'use client';

import { useState, useRef, useEffect } from 'react';
import { sample } from './actions';
import { motion, AnimatePresence } from 'motion/react';
import Visualizer from './components/Visualizer';
import { Mic, MicOff, Send } from 'lucide-react';

const useAudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setStream(mediaStream);

            const mediaRecorder = new MediaRecorder(mediaStream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);

                // Don't stop tracks immediately if we want to visualize "finishing" or keep stream warm, 
                // but usually good practice to stop. For visualizer, we might need stream until component unmounts 
                // or specific stop. For this logic, we'll stop tracks here to be clean.
                mediaStream.getTracks().forEach((track) => track.stop());
                setStream(null);
            };

            mediaRecorder.start();
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

    return { isRecording, stream, audioBlob, startRecording, stopRecording, setAudioBlob };
};

export default function JarvisInterface() {
    const { isRecording, stream, audioBlob, startRecording, stopRecording, setAudioBlob } = useAudioRecorder();
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcript, setTranscript] = useState<string>("");
    const [showTranscript, setShowTranscript] = useState(false);

    useEffect(() => {
        if (audioBlob) {
            handleTranscribe(audioBlob);
        }
    }, [audioBlob]);

    const handleTranscribe = async (blob: Blob) => {
        setIsProcessing(true);
        setShowTranscript(true);
        try {
            // Optimistically show processing state
            const result = await sample(blob);
            setTranscript(result || "I couldn't hear that properly.");
        } catch (e) {
            console.error(e);
            setTranscript("Error processing audio.");
        } finally {
            setIsProcessing(false);
            setAudioBlob(null); // Reset blob so we can record again without re-triggering immediately
        }
    };

    const handleToggleRecord = () => {
        if (isRecording) {
            stopRecording();
        } else {
            console.log("Starting recording...");
            setTranscript(""); // Clear previous
            setShowTranscript(false);
            startRecording();
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-black text-cyan-500 overflow-hidden font-mono flex flex-col items-center justify-center">

            {/* Background Grid / HUD elements */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-10"></div>
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10"></div>

            {/* Header */}
            <header className="absolute top-8 w-full flex justify-between px-12 z-20 uppercase tracking-[0.3em] text-xs opacity-70">
                <span>System: Online</span>
                <span>Jarvis OS v2.0</span>
                <span>Battery: 100%</span>
            </header>

            {/* Main Visualizer Area */}
            <main className="relative z-10 flex flex-col items-center justify-center space-y-8">

                <div
                    className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
                    onClick={handleToggleRecord}
                >
                    <Visualizer
                        stream={stream}
                        isListening={isRecording}
                        isProcessing={isProcessing}
                    />
                </div>

                {/* Status Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center h-8"
                >
                    {isRecording && <p className="animate-pulse tracking-widest text-red-500">LISTENING...</p>}
                    {isProcessing && <p className="animate-pulse tracking-widest text-yellow-400">PROCESSING...</p>}
                    {!isRecording && !isProcessing && !transcript && <p className="tracking-widest opacity-50">TAP CORE TO INITIALIZE</p>}
                </motion.div>

                {/* Transcription Output */}
                <AnimatePresence>
                    {(transcript || showTranscript) && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="max-w-2xl w-full text-center px-6"
                        >
                            <div className="border border-cyan-500/30 bg-black/50 backdrop-blur-md p-6 rounded-lg shadow-[0_0_15px_rgba(0,255,255,0.1)]">
                                <h3 className="text-xs text-cyan-300 uppercase tracking-widest mb-2 border-b border-cyan-800 pb-1 w-fit mx-auto">
                                    Transcribed Data
                                </h3>
                                <p className="text-lg text-white/90 leading-relaxed min-h-[1.5rem]">
                                    {isProcessing ? <span className="animate-pulse">Analyzing audio stream...</span> : transcript}
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </main>

            {/* Controls (Alternative to clicking center) */}
            <div className="absolute bottom-12 flex items-center gap-6 z-20">
                <button
                    onClick={handleToggleRecord}
                    className={`
                        p-4 rounded-full border transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)]
                        ${isRecording
                            ? 'bg-red-500/20 border-red-500 text-red-500 hover:bg-red-500/40 hover:shadow-[0_0_30px_rgba(255,0,0,0.4)]'
                            : 'bg-cyan-500/10 border-cyan-500 text-cyan-500 hover:bg-cyan-500/20 hover:shadow-[0_0_30px_rgba(0,255,255,0.4)]'
                        }
                    `}
                >
                    {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>
            </div>

        </div>
    );
}