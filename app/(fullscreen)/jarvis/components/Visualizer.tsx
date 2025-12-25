'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface VisualizerProps {
    stream: MediaStream | null;
    isListening: boolean;
    isProcessing: boolean;
}

export default function Visualizer({ stream, isListening, isProcessing }: VisualizerProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>(0);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const dataArrayRef = useRef<Uint8Array | null>(null);

    useEffect(() => {
        if (!stream || !isListening) {
            cancelAnimationFrame(animationRef.current);
            return;
        }

        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();

        analyser.fftSize = 256;
        source.connect(analyser);

        analyserRef.current = analyser;
        const bufferLength = analyser.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);

        const draw = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const width = canvas.width;
            const height = canvas.height;
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = 80; // Base radius

            if (!analyserRef.current || !dataArrayRef.current) return;

            // analyserRef.current.getByteFrequencyData(dataArrayRef.current);

            ctx.clearRect(0, 0, width, height);

            // Jarvis Core Glow
            const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.5, centerX, centerY, radius * 2);
            gradient.addColorStop(0, 'rgba(0, 255, 255, 0.1)'); // Cyan core
            gradient.addColorStop(0.5, 'rgba(0, 150, 255, 0.05)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius * 3, 0, 2 * Math.PI);
            ctx.fill();

            // Draw Circular Waveform
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#00ffff'; // Cyan
            ctx.beginPath();

            const bufferLength = analyserRef.current.frequencyBinCount;
            const angleStep = (2 * Math.PI) / bufferLength;

            for (let i = 0; i < bufferLength; i++) {
                const value = dataArrayRef.current[i];
                const normalized = value / 255;
                const r = radius + (normalized * 50); // Expanding radius based on volume

                // Mirroring for symmetry (optional, but looks good for Jarvis)
                const angle = i * angleStep;

                const x = centerX + r * Math.cos(angle);
                const y = centerY + r * Math.sin(angle);

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            // Close the loop
            const value = dataArrayRef.current[0];
            const normalized = value / 255;
            const r = radius + (normalized * 50);
            const x = centerX + r * Math.cos(0);
            const y = centerY + r * Math.sin(0);
            ctx.lineTo(x, y);

            ctx.stroke();

            // Inner static ring for "Idle" feel when quiet
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
            ctx.lineWidth = 1;
            ctx.stroke();

            animationRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationRef.current);
            if (audioContext.state !== 'closed') {
                audioContext.close();
            }
        };
    }, [stream, isListening]);

    return (
        <div className="relative flex items-center justify-center w-[400px] h-[400px]">
            {/* Background Idle Animation */}
            {!isListening && !isProcessing && (
                <motion.div
                    className="absolute w-48 h-48 rounded-full border border-cyan-500/30"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
            )}

            {/* Processing Spinner */}
            {isProcessing && (
                <motion.div
                    className="absolute w-56 h-56 rounded-full border-t-2 border-r-2 border-cyan-400"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
            )}

            <canvas
                ref={canvasRef}
                width={400}
                height={400}
                className="z-10"
            />
        </div>
    );
}
