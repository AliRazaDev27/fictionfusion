"use client";
import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Shuffle, 
  Volume2, 
  VolumeX,
  Settings2,
  ListMusic
} from 'lucide-react';

const PlayerDeck = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(75);
  const [progress, setProgress] = useState(45); // 45%

  // Visual helper for the volume blocks
  const volumeBlocks = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  return (
    <div className="h-full w-full bg-slate-950 border-t border-slate-800 flex items-center justify-between px-6 relative overflow-hidden">
      
      {/* Background Texture (Subtle Grid) */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#22d3ee 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      {/* --- LEFT SECTOR: TIMECODE & META --- */}
      <div className="w-[200px] flex items-center gap-4 relative z-10">
         {/* Time Display (LED Style) */}
         <div className="bg-black/50 border border-slate-800 px-3 py-1 rounded-sm font-mono text-cyan-500 text-lg tracking-widest shadow-[0_0_10px_rgba(6,182,212,0.15)]">
            03:45<span className="text-slate-600 text-xs">.12</span>
         </div>
         <div className="text-[10px] font-mono text-slate-500 flex flex-col">
            <span>TOTAL: 05:12</span>
            <span className="text-emerald-500">SYNC: OK</span>
         </div>
      </div>


      {/* --- CENTER SECTOR: TRANSPORT & SCRUBBER --- */}
      <div className="flex-1 max-w-2xl flex flex-col gap-2 items-center relative z-10">
         
         {/* 1. The Scrubber (Segmented LED Bar) */}
         <div className="w-full flex items-center gap-3 group">
            <span className="text-[10px] font-mono text-slate-600 group-hover:text-cyan-500 transition-colors">-01:27</span>
            
            <div className="relative flex-1 h-3 bg-slate-900 border border-slate-800 rounded-sm cursor-pointer overflow-hidden">
               {/* The Fill */}
               <div 
                 className="absolute top-0 left-0 h-full bg-cyan-600/80 transition-all duration-100" 
                 style={{ width: `${progress}%` }}
               ></div>
               
               {/* The Segment Overlay (Creates the 'Blocks' look) */}
               <div className="absolute inset-0 w-full h-full" 
                    style={{ background: 'repeating-linear-gradient(90deg, transparent 0, transparent 2px, #020617 2px, #020617 4px)' }}>
               </div>

               {/* The "Head" Indicator */}
               <div className="absolute top-0 h-full w-0.5 bg-white shadow-[0_0_10px_white]" style={{ left: `${progress}%` }}></div>
            </div>

            <span className="text-[10px] font-mono text-slate-600 group-hover:text-cyan-500 transition-colors">05:12</span>
         </div>

         {/* 2. Transport Buttons (Hardware Feel) */}
         <div className="flex items-center gap-1">
            
            <button className="w-8 h-8 flex items-center justify-center rounded-sm border border-transparent hover:border-slate-700 hover:bg-slate-900 text-slate-500 hover:text-cyan-400 transition-all">
               <Shuffle className="w-3 h-3" />
            </button>

            {/* Main Cluster */}
            <div className="flex items-center gap-0.5 bg-slate-900 border border-slate-800 rounded-sm p-0.5">
               <button className="w-10 h-8 flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border-r border-slate-800">
                  <SkipBack className="w-4 h-4 fill-current" />
               </button>
               
               <button 
                 onClick={() => setIsPlaying(!isPlaying)}
                 className={`w-12 h-8 flex items-center justify-center hover:bg-slate-800 transition-colors ${isPlaying ? 'text-cyan-400' : 'text-white'}`}
               >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
               </button>
               
               <button className="w-10 h-8 flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border-l border-slate-800">
                  <SkipForward className="w-4 h-4 fill-current" />
               </button>
            </div>

            <button className="w-8 h-8 flex items-center justify-center rounded-sm border border-transparent hover:border-slate-700 hover:bg-slate-900 text-slate-500 hover:text-cyan-400 transition-all">
               <Repeat className="w-3 h-3" />
            </button>
         </div>
      </div>


      {/* --- RIGHT SECTOR: OUTPUT / GAIN --- */}
      <div className="w-[200px] flex items-center justify-end gap-6 relative z-10">
         
         {/* Volume Gain Blocks */}
         <div className="flex items-center gap-2 group">
             <button 
               onClick={() => setVolume(v => v === 0 ? 75 : 0)}
               className="text-slate-500 hover:text-white"
             >
                {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
             </button>
             
             <div className="flex gap-[2px] cursor-pointer">
                {volumeBlocks.map((level) => (
                   <div 
                      key={level}
                      onClick={() => setVolume(level)}
                      className={`w-1.5 h-4 rounded-[1px] transition-all ${
                         volume >= level 
                           ? 'bg-cyan-500 shadow-[0_0_5px_rgba(6,182,212,0.5)]' 
                           : 'bg-slate-800 group-hover:bg-slate-700'
                      }`}
                   ></div>
                ))}
             </div>
         </div>

         {/* Extra Options */}
         <div className="flex gap-1 border-l border-slate-800 pl-4">
             <button className="p-2 text-slate-500 hover:text-white hover:bg-slate-900 rounded-sm">
                <Settings2 className="w-4 h-4" />
             </button>
             <button className="p-2 text-slate-500 hover:text-white hover:bg-slate-900 rounded-sm lg:hidden">
                <ListMusic className="w-4 h-4" />
             </button>
         </div>

      </div>
    </div>
  );
};

export default PlayerDeck;