"use client";
import React, { useState } from 'react';
import { useVisualizer } from './VisualizerContext';
import { X, Zap, Mic, Radio, Music } from 'lucide-react';

interface EqualizerModalProps {
    onClose: () => void;
}

const PRESETS = [
    { name: 'Flat', values: [0, 0, 0, 0, 0], icon: <Zap className="w-3 h-3" /> },
    { name: 'Bass Boost', values: [8, 5, -2, 2, 5], icon: <Music className="w-3 h-3" /> },
    { name: 'Vocal', values: [-4, -2, 5, 3, 2], icon: <Mic className="w-3 h-3" /> },
    { name: 'Cyberpunk', values: [6, 3, -2, 3, 6], icon: <Radio className="w-3 h-3" /> },
];

const EqualizerModal: React.FC<EqualizerModalProps> = ({ onClose }) => {
    const { eqGains, setEQGain } = useVisualizer();
    const [activePreset, setActivePreset] = useState<string>('Custom');

    const bands = [
        { label: '60Hz', type: 'Low' },
        { label: '310Hz', type: 'Mid-Low' },
        { label: '1.5kHz', type: 'Mid' },
        { label: '6kHz', type: 'Mid-High' },
        { label: '16kHz', type: 'High' }
    ];

    const applyPreset = (preset: typeof PRESETS[0]) => {
        preset.values.forEach((val, idx) => setEQGain(idx, val));
        setActivePreset(preset.name);
    }

    const handleSliderChange = (idx: number, val: number) => {
        setEQGain(idx, val);
        setActivePreset('Custom');
    }

    return (
        <div className="absolute bottom-28 right-6 bg-slate-950/95 border border-slate-800 p-4 rounded-lg shadow-2xl backdrop-blur-md z-50 w-[300px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-3 h-3" />
                    EQ_CALIBRATION
                </span>
                <button onClick={onClose} className="text-slate-500 hover:text-white">
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 gap-2 mb-6">
                {PRESETS.map(preset => (
                    <button
                        key={preset.name}
                        onClick={() => applyPreset(preset)}
                        className={`flex items-center gap-2 text-[10px] font-mono border rounded px-2 py-1.5 transition-all ${activePreset === preset.name
                                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                                : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                    >
                        {preset.icon}
                        {preset.name}
                    </button>
                ))}
            </div>

            {/* Sliders Container */}
            <div className="flex justify-between h-32 px-2">
                {bands.map((band, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 h-full">
                        {/* Gain Value */}
                        <div className="text-[9px] font-mono text-cyan-500 h-3">
                            {eqGains[idx] > 0 ? `+${eqGains[idx]}` : eqGains[idx]}
                        </div>

                        {/* Slider Track (Vertical) */}
                        <div className="relative flex-1 w-1.5 bg-slate-900 rounded-full overflow-hidden group">
                            {/* Input Range on top */}
                            <input
                                type="range"
                                min="-12"
                                max="12"
                                step="1"
                                value={eqGains[idx]}
                                onChange={(e) => handleSliderChange(idx, parseFloat(e.target.value))}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 appearance-none"
                                style={{ WebkitAppearance: 'slider-vertical' as any }}
                            />

                            {/* Visual Track Fill */}
                            <div
                                className="absolute bottom-0 w-full bg-slate-800 transition-all duration-300 ease-out"
                                style={{
                                    height: `${((eqGains[idx] + 12) / 24) * 100}%`,
                                    backgroundColor: eqGains[idx] === 0 ? '#475569' : '#06b6d4'
                                }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Sub Labels */}
            <div className="flex justify-between px-2 mt-2">
                {bands.map((band, idx) => (
                    <span key={idx} className="text-[8px] text-slate-600 font-mono w-4 text-center">
                        {band.label.replace('Hz', '').replace('kHz', 'k')}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default EqualizerModal;
