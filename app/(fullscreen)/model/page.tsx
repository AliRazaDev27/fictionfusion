'use client';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { Avatar } from './avatar';
import { useState, Suspense, useCallback } from 'react';

export default function Scene() {
    const [morphTargets, setMorphTargets] = useState<string[]>([]);
    const [morphValues, setMorphValues] = useState<Record<string, number>>({});
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const handleMorphTargetsLoaded = useCallback((targets: string[]) => {
        setMorphTargets(targets);
        // Initialize all morph targets to 0
        const initialValues: Record<string, number> = {};
        targets.forEach((name) => {
            initialValues[name] = 0;
        });
        setMorphValues(initialValues);
    }, []);

    const handleSliderChange = (name: string, value: number) => {
        setMorphValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const resetAll = () => {
        const resetValues: Record<string, number> = {};
        morphTargets.forEach((name) => {
            resetValues[name] = 0;
        });
        setMorphValues(resetValues);
    };

    const filteredTargets = morphTargets.filter((name) =>
        name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-screen w-full bg-gray-950 flex">
            {/* Sidebar */}
            <div
                className={`
                    ${sidebarOpen ? 'w-80' : 'w-0'}
                    transition-all duration-300 ease-in-out
                    bg-gradient-to-b from-gray-900/95 to-gray-950/95
                    backdrop-blur-xl border-r border-white/10
                    flex flex-col overflow-hidden relative z-10
                `}
            >
                {sidebarOpen && (
                    <div className="flex flex-col h-full">
                        {/* Header */}
                        <div className="p-4 border-b border-white/10">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Morph Controls
                                </h2>
                                <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded-full">
                                    {morphTargets.length} shapes
                                </span>
                            </div>

                            {/* Search */}
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search shapes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Morph Target Sliders */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                            {filteredTargets.length === 0 ? (
                                <div className="text-center text-gray-500 py-8">
                                    <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm">
                                        {morphTargets.length === 0 ? 'Loading morph targets...' : 'No matching shapes found'}
                                    </p>
                                </div>
                            ) : (
                                filteredTargets.map((name) => (
                                    <div
                                        key={name}
                                        className="group bg-gray-800/30 hover:bg-gray-800/50 rounded-lg p-3 transition-all duration-200"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm text-gray-300 font-medium truncate pr-2" title={name}>
                                                {name}
                                            </label>
                                            <span className="text-xs text-purple-400 font-mono bg-purple-500/10 px-2 py-0.5 rounded">
                                                {(morphValues[name] ?? 0).toFixed(2)}
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value={morphValues[name] ?? 0}
                                            onChange={(e) => handleSliderChange(name, parseFloat(e.target.value))}
                                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500
                                                [&::-webkit-slider-thumb]:appearance-none
                                                [&::-webkit-slider-thumb]:w-4
                                                [&::-webkit-slider-thumb]:h-4
                                                [&::-webkit-slider-thumb]:bg-purple-500
                                                [&::-webkit-slider-thumb]:rounded-full
                                                [&::-webkit-slider-thumb]:shadow-lg
                                                [&::-webkit-slider-thumb]:shadow-purple-500/30
                                                [&::-webkit-slider-thumb]:transition-transform
                                                [&::-webkit-slider-thumb]:hover:scale-110
                                            "
                                        />
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer with Reset */}
                        <div className="p-4 border-t border-white/10">
                            <button
                                onClick={resetAll}
                                className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Reset All
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`
                    absolute top-4 z-20 p-2.5 rounded-lg
                    bg-gray-800/80 backdrop-blur-sm border border-white/10
                    text-white hover:bg-gray-700/80 transition-all duration-200
                    shadow-lg hover:shadow-xl
                    ${sidebarOpen ? 'left-[332px]' : 'left-4'}
                `}
            >
                <svg
                    className={`w-5 h-5 transition-transform duration-300 ${sidebarOpen ? '' : 'rotate-180'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
            </button>

            {/* Canvas */}
            <div className="flex-1 relative">
                <Canvas camera={{ position: [0, 0, -30], fov: 30 }}>
                    <Environment preset="apartment" />
                    <OrbitControls />
                    <Suspense fallback={null}>
                        <Avatar
                            morphTargetInfluences={morphValues}
                            onMorphTargetsLoaded={handleMorphTargetsLoaded}
                        />
                    </Suspense>
                </Canvas>
            </div>
        </div>
    );
}

