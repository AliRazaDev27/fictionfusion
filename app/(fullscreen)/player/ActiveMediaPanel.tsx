import React from 'react';
import { Disc, Mic2, Activity, List, Cast } from 'lucide-react';

const ActiveMediaPanel = () => {
  return (
    <aside className="w-[300px] border-l border-slate-800 bg-slate-950 flex-col hidden lg:flex">
      
      {/* 1. Header: Now Playing Status */}
      <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-950/50">
         <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-3 h-3 text-cyan-500" />
            Audio_Telemetry
         </span>
         <div className="flex gap-1">
             <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></div>
         </div>
      </div>

      {/* 2. The "Holographic" Art Card */}
      <div className="p-4 relative">
         <div className="relative aspect-square rounded-lg overflow-hidden border border-slate-700 group shadow-2xl shadow-cyan-900/10">
            {/* The Image */}
            <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
               <Disc className="w-12 h-12 text-slate-700 animate-spin-slow" />
               {/* Replace this div with <img src="..." /> */}
            </div>
            
            {/* The Data Overlay (Glassmorphism) */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pt-12">
               <h2 className="text-lg font-bold text-white leading-tight mb-1">Night on the Galactic Railroad</h2>
               <p className="text-cyan-400 text-xs font-mono">Joe Hisaishi</p>
            </div>
            
            {/* Status Badge */}
            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur border border-white/10 px-2 py-1 rounded text-[9px] font-mono text-white uppercase">
               Lossless
            </div>
         </div>
      </div>

      {/* 3. Signal Analysis (Fake Visualizer) */}
      <div className="px-4 pb-6 border-b border-slate-800">
         <div className="flex justify-between text-[10px] text-slate-500 mb-2 font-mono uppercase">
            <span>L Channel</span>
            <span>R Channel</span>
         </div>
         {/* A fake spectrum analyzer */}
         <div className="flex items-end justify-between h-12 gap-1 opacity-60">
            {[40, 70, 35, 60, 80, 50, 90, 30, 60, 40, 70, 20].map((h, i) => (
               <div key={i} className="w-full bg-cyan-900/50 rounded-t-sm relative overflow-hidden group">
                  <div className="absolute bottom-0 w-full bg-cyan-500 transition-all duration-300 animate-pulse" style={{ height: `${h}%` }}></div>
               </div>
            ))}
         </div>
      </div>

      {/* 4. Queue / Next Operations */}
      <div className="flex-1 overflow-y-auto bg-slate-900/20">
         <div className="px-4 py-3 border-b border-slate-800/50 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            // QUEUE_SEQUENCE
         </div>
         
         <div className="p-2 space-y-1">
            {[1, 2, 3].map((i) => (
               <div key={i} className="flex items-center gap-3 p-2 rounded hover:bg-slate-800/50 group cursor-pointer border border-transparent hover:border-slate-700 transition-all">
                  <div className="text-slate-600 text-[10px] font-mono">0{i}</div>
                  <div className="min-w-0">
                     <div className="text-xs text-slate-300 truncate group-hover:text-cyan-400 transition-colors">Fantasy Nocturne</div>
                     <div className="text-[10px] text-slate-600 truncate">Synthesizer V</div>
                  </div>
               </div>
            ))}
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