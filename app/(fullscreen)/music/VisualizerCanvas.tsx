"use client";
import React, { useEffect, useRef } from 'react';
import { useVisualizer } from './VisualizerContext';

interface VisualizerCanvasProps {
    className?: string;
    width?: number;
    height?: number;
    barWidthScale?: number; // Allows thicker bars in Zen Mode
}

const VisualizerCanvas: React.FC<VisualizerCanvasProps> = ({ className, width, height, barWidthScale = 2.5 }) => {
    const { analyser } = useVisualizer();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!analyser || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Handle responsive canvas size if width/height not fixed
        if (!width || !height) {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        let animationId: number;

        const draw = () => {
            animationId = requestAnimationFrame(draw);
            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Drawing Setup
            // Use passed scale or calculate based on canvas width
            const bWidth = (canvas.width / bufferLength) * barWidthScale;

            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                // Scale height to fit canvas
                // dataArray is 0-255. 
                // We want max volume to hit max height.
                const scaleModifier = canvas.height / 255;
                barHeight = dataArray[i] * scaleModifier;

                // Dynamic Color: Cyberpunk Spectrum (HSL)
                const hue = (i / bufferLength) * 360;

                ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;

                // Draw Bar
                ctx.fillRect(x, canvas.height - barHeight, bWidth, barHeight);

                x += bWidth + 1; // 1px gap
            }
        }

        draw();

        return () => {
            cancelAnimationFrame(animationId);
        }
    }, [analyser, width, height, barWidthScale]);

    return (
        <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className={className}
        />
    );
};

export default VisualizerCanvas;
