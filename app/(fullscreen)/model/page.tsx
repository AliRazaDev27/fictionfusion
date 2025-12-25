'use client';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Avatar } from './avatar';
import { useState, Suspense } from 'react';

export default function Scene() {
    const [audioUrl, setAudioUrl] = useState<string | null>(null); // URL from your TTS API
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className="h-screen w-full bg-gray-950">
            {/* Adjusted camera fov and position for a better portrait shot */}
            <Canvas camera={{ position: [0, -10, 0], fov: 10 }}>
                {/* Lighting */}
                {/* <ambientLight intensity={0.1} /> */}
                {/* <directionalLight position={[0, 5, 5]} intensity={0.5} /> */}
                <Environment preset="apartment" />

                {/* The Talking Head */}
                <Suspense fallback={null}>
                    <Avatar />
                </Suspense>
            </Canvas>
        </div>
    );
}

