"use client";
import React, { createContext, useContext, useRef, useState, useEffect } from 'react';

interface VisualizerContextType {
    audioContext: AudioContext | null;
    analyser: AnalyserNode | null;
    source: MediaElementAudioSourceNode | null;
    initializeAudio: (audioElement: HTMLAudioElement) => void;
    isInitialized: boolean;
}

const VisualizerContext = createContext<VisualizerContextType | undefined>(undefined);

export const VisualizerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

    const initializeAudio = (audioElement: HTMLAudioElement) => {
        if (sourceRef.current) return; // Already initialized

        try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            const ctx = new AudioContextClass();
            audioContextRef.current = ctx;

            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256; // Controls bar count (128 bins)
            analyserRef.current = analyser;

            const source = ctx.createMediaElementSource(audioElement);
            source.connect(analyser);
            analyser.connect(ctx.destination);
            sourceRef.current = source;

            setIsInitialized(true);
            console.log("Audio Context Initialized");
        } catch (error) {
            console.error("Failed to init audio context:", error);
        }
    };

    // Auto-resume context if suspended (browser autoplay policy)
    useEffect(() => {
        const handleInteraction = () => {
            if (audioContextRef.current?.state === 'suspended') {
                audioContextRef.current.resume();
            }
        };
        window.addEventListener('click', handleInteraction);
        return () => window.removeEventListener('click', handleInteraction);
    }, []);

    return (
        <VisualizerContext.Provider value={{
            audioContext: audioContextRef.current,
            analyser: analyserRef.current,
            source: sourceRef.current,
            initializeAudio,
            isInitialized
        }}>
            {children}
        </VisualizerContext.Provider>
    );
};

export const useVisualizer = () => {
    const context = useContext(VisualizerContext);
    if (!context) {
        throw new Error("useVisualizer must be used within a VisualizerProvider");
    }
    return context;
};
