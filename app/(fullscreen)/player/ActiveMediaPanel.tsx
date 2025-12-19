"use client";
import React, { useEffect, useRef } from 'react';
import { Disc, Mic2, Activity } from 'lucide-react';
import { useMusicStore } from '@/app/(main)/music/music-context';
import { Music } from '@/lib/database/musicSchema';
import { useVisualizer } from './VisualizerContext';

const ActiveMediaPanel = () => {
   const { music, current, setCurrent } = useMusicStore((state: any) => state);
   const currentTrack: Music | undefined = music && music[current];

   // Visualizer Context
   const { analyser, isInitialized } = useVisualizer();
   const canvasRef = useRef<HTMLCanvasElement | null>(null);

   // Get next 3 songs for the queue
   const queue = music ? music.slice(current + 1, current + 4) : [];

   // Visualizer Loop
   useEffect(() => {
      if (!analyser || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      let animationId: number;

      const draw = () => {
         animationId = requestAnimationFrame(draw);
         analyser.getByteFrequencyData(dataArray);

         ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

         // Drawing Setup
         const barWidth = (canvas.width / bufferLength) * 2.5;
         let barHeight;
         let x = 0;

         for (let i = 0; i < bufferLength; i++) {
            // Adjusted sensitivity: / 4 maps 0-255 range to 0-63.75px (fitting 64px height)
            barHeight = dataArray[i] / 4;

            // Dynamic Color: Cyberpunk Spectrum (Purple -> Cyan -> Green)
            // Mapping index i to Hue (approx 260 to 160 range reverse or full spectrum)
            // Let's do a full spectrum loop for maximum color
            const hue = (i / bufferLength) * 360;

            ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;

            // Draw Bar
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

            x += barWidth + 1;
         }
      }

      draw();

      return () => {
         cancelAnimationFrame(animationId);
      }
   }, [analyser]);

   return (
      <aside className="w-[300px] border-l border-slate-800 bg-slate-950 flex-col hidden lg:flex">

         {/* 1. Header: Now Playing Status */}
         <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-950/50">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
               <Activity className="w-3 h-3 text-cyan-500" />
               Audio_Telemetry
            </span>
            <div className="flex gap-1">
               <div className={`w-1.5 h-1.5 rounded-full ${isInitialized ? 'bg-cyan-500 animate-pulse' : 'bg-red-500'}`}></div>
            </div>
         </div>

         {/* 2. The "Holographic" Art Card */}
         <div className="p-4 relative">
            <div className="relative aspect-square rounded-lg overflow-hidden border border-slate-700 group shadow-2xl shadow-cyan-900/10">
               {/* The Image */}
               <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                  {currentTrack?.coverArt ? (
                     <img src={currentTrack.coverArt} className="w-full h-full object-cover" alt="Cover" />
                  ) : (
                     <Disc className="w-12 h-12 text-slate-700 animate-spin-slow" />
                  )}
               </div>

               {/* The Data Overlay (Glassmorphism) */}
               <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pt-12">
                  <h2 className="text-lg font-bold text-white leading-tight mb-1 truncate">{currentTrack?.title || "No Media"}</h2>
                  <p className="text-cyan-400 text-xs font-mono truncate">{currentTrack?.artist || "Standby..."}</p>
               </div>

               {/* Status Badge */}
               <div className="absolute top-2 right-2 bg-black/60 backdrop-blur border border-white/10 px-2 py-1 rounded text-[9px] font-mono text-white uppercase">
                  Lossless
               </div>
            </div>
         </div>

         {/* 3. Real-Time Signal Analysis */}
         <div className="px-4 pb-6 border-b border-slate-800 h-24 flex items-end">
            <div className="w-full h-16 bg-black/20 rounded border border-slate-800/50 relative overflow-hidden">
               {!isInitialized && (
                  <div className="absolute inset-0 flex items-center justify-center text-[9px] text-slate-600 font-mono">
                     WAITING FOR SIGNAL...
                  </div>
               )}
               <canvas
                  ref={canvasRef}
                  width={266}
                  height={64}
                  className="w-full h-full opacity-80"
               ></canvas>
            </div>
         </div>

         {/* 4. Queue / Next Operations */}
         <div className="flex-1 overflow-y-auto bg-slate-900/20">
            <div className="px-4 py-3 border-b border-slate-800/50 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            // QUEUE_SEQUENCE
            </div>

            <div className="p-2 space-y-1">
               {queue.length > 0 ? (
                  queue.map((track: Music, i: number) => (
                     <div
                        key={track.id}
                        onClick={() => setCurrent(current + 1 + i)}
                        className="flex items-center gap-3 p-2 rounded hover:bg-slate-800/50 group cursor-pointer border border-transparent hover:border-slate-700 transition-all"
                     >
                        <div className="text-slate-600 text-[10px] font-mono">0{i + 1}</div>
                        <div className="min-w-0">
                           <div className="text-xs text-slate-300 truncate group-hover:text-cyan-400 transition-colors">{track.title}</div>
                           <div className="text-[10px] text-slate-600 truncate">{track.artist}</div>
                        </div>
                     </div>
                  ))
               ) : (
                  <div className="p-4 text-[10px] text-slate-600 font-mono text-center">END OF PLAYLIST</div>
               )}
            </div>
         </div>

         {/* 5. Lyrics / Lyrics Toggle */}
         <div className="p-4 border-t border-slate-800 bg-slate-950">
            <button className="w-full flex items-center justify-center gap-2 py-2 rounded border border-slate-800 bg-slate-900/50 text-xs text-slate-400 hover:text-white hover:border-slate-600 transition-all font-mono">
               <Mic2 className="w-3 h-3" />
               EXPAND_LYRICS_TERMINAL
            </button>
         </div>

      </aside>
   );
};

export default ActiveMediaPanel;