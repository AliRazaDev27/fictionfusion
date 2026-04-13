"use client";
import React, { createContext, useContext, useRef, useState, useEffect } from 'react';

interface VisualizerContextType {
    audioContext: AudioContext | null;
    analyser: AnalyserNode | null;
    source: MediaElementAudioSourceNode | null;
    initializeAudio: (audioElement: HTMLAudioElement) => void;
    isInitialized: boolean;
    // EQ
    setEQGain: (index: number, value: number) => void;
    eqGains: number[];
}

const VisualizerContext = createContext<VisualizerContextType | undefined>(undefined);

export const VisualizerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isInitialized, setIsInitialized] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

    // EQ Filters Refs
    const filtersRef = useRef<BiquadFilterNode[]>([]);
    const [eqGains, setEqGains] = useState<number[]>([0, 0, 0, 0, 0]);

    const initializeAudio = (audioElement: HTMLAudioElement) => {
        if (sourceRef.current) return; // Already initialized

        try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            const ctx = new AudioContextClass();
            audioContextRef.current = ctx;

            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256;
            analyserRef.current = analyser;

            const source = ctx.createMediaElementSource(audioElement);
            sourceRef.current = source;

            // Create EQ Filters (5 Bands)
            // 60Hz (Low), 310Hz (Low-Mid), 1.5kHz (Mid), 6kHz (High-Mid), 16kHz (High)
            const frequencies = [60, 310, 1500, 6000, 16000];
            const filters = frequencies.map((freq, i) => {
                const filter = ctx.createBiquadFilter();
                filter.frequency.value = freq;
                // Types: LowShelf for bass, HighShelf for treble, Peaking for mids
                if (i === 0) filter.type = 'lowshelf';
                else if (i === frequencies.length - 1) filter.type = 'highshelf';
                else filter.type = 'peaking';

                // Q value for peaking (bandwidth)
                if (filter.type === 'peaking') filter.Q.value = 1;

                return filter;
            });
            filtersRef.current = filters;

            // Connect Chain: Source -> Filter[0] -> ... -> Filter[4] -> Analyser -> Destination
            source.connect(filters[0]);
            for (let i = 0; i < filters.length - 1; i++) {
                filters[i].connect(filters[i + 1]);
            }
            filters[filters.length - 1].connect(analyser); // Connect last filter to analyser
            analyser.connect(ctx.destination);

            setIsInitialized(true);
            console.log("Audio Context & EQ Initialized");
        } catch (error) {
            console.error("Failed to init audio context:", error);
        }
    };

    const setEQGain = (index: number, value: number) => {
        // Value between -12 and 12 dB usually
        if (filtersRef.current[index] && audioContextRef.current) {
            filtersRef.current[index].gain.value = value;

            // Update state for UI
            setEqGains(prev => {
                const newGains = [...prev];
                newGains[index] = value;
                return newGains;
            });
        }
    }

    // Auto-resume context if suspended
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
            isInitialized,
            setEQGain,
            eqGains
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
