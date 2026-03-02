import React from 'react';
import { 
  Brain, 
  Database, 
  WifiOff, 
  Terminal, 
  Music, 
  Activity, 
  Layers, 
  Cpu 
} from 'lucide-react';

const BentoGrid = () => {
  return (
    <section className="bg-slate-950 text-slate-200 min-h-screen p-8 font-sans selection:bg-cyan-500/30">
      
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-8 flex items-end justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">SYSTEM MODULES</h2>
          <p className="font-mono text-xs text-cyan-500 mt-1">
            // ARCHITECTURE_OVERVIEW // v2.4.0
          </p>
        </div>
        <div className="hidden md:block text-right font-mono text-xs text-slate-500">
          STATUS: <span className="text-emerald-500">OPERATIONAL</span><br/>
          UPTIME: 99.9%
        </div>
      </div>

      {/* Grid Container */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 auto-rows-[180px] gap-4">

        {/* --- Card 1: AI Core (Large, Hero-like) --- */}
        <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 hover:border-cyan-500/50 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="p-6 h-full flex flex-col justify-between relative z-10">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                <Brain className="w-6 h-6 text-indigo-400" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 border border-slate-800 px-2 py-1 rounded">
                Gemini Pro Model
              </span>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">Neural Intelligence</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Personalized recommendation engine analyzing reading patterns and viewing habits with predictive content scoring.
              </p>
              
              {/* Pseudo-Code Visual */}
              <div className="mt-4 p-3 bg-black/40 rounded border border-slate-800 font-mono text-xs text-indigo-300 overflow-hidden">
                <span className="text-purple-400">const</span> insight = <span className="text-yellow-400">await</span> ai.analyze(userPreferences);
              </div>
            </div>
          </div>
        </div>

        {/* --- Card 2: Music / Offline (Tall) --- */}
        <div className="md:col-span-1 md:row-span-2 relative group rounded-xl border border-slate-800 bg-slate-900/50 hover:border-emerald-500/50 transition-all duration-300">
          <div className="p-6 h-full flex flex-col relative">
            <div className="flex justify-between items-center mb-4">
              <Music className="w-5 h-5 text-emerald-400" />
              <WifiOff className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </div>
            
            <h3 className="text-lg font-bold text-white mb-1">Audio Engine</h3>
            <p className="text-xs text-slate-400 font-mono mb-6">PWA • OFFLINE FIRST</p>
            
            {/* Visualizer Mockup */}
            <div className="flex-grow flex items-end justify-center gap-1 pb-4 opacity-50 group-hover:opacity-100 transition-opacity">
              {[40, 70, 30, 80, 50, 90, 20].map((h, i) => (
                <div key={i} className="w-2 bg-emerald-500/80 rounded-t-sm transition-all duration-500" style={{ height: `${h}%` }}></div>
              ))}
            </div>
            
            <div className="text-xs text-slate-500 border-t border-slate-800 pt-3 mt-auto">
              Syncing with Cloudinary via Service Workers.
            </div>
          </div>
        </div>

        {/* --- Card 3: Scrapers (Wide) --- */}
        <div className="md:col-span-1 md:row-span-1 relative group rounded-xl border border-slate-800 bg-slate-900/50 hover:border-amber-500/50 transition-all duration-300">
          <div className="p-5 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span className="font-mono text-xs text-amber-400">SCRAPER_LOGS</span>
            </div>
            <div className="flex-grow bg-black/40 rounded p-2 font-mono text-[10px] text-slate-400 leading-tight border border-slate-800/50">
              <p className="text-green-500/80"> success: true</p>
              <p> source: 'mydramalist'</p>
              <p> items_fetched: 24</p>
              <p className="animate-pulse">_ processing...</p>
            </div>
          </div>
        </div>

        {/* --- Card 4: Tech Stack (Small) --- */}
        <div className="md:col-span-1 md:row-span-1 relative rounded-xl border border-slate-800 bg-slate-900/50 p-5 flex flex-col justify-center hover:bg-slate-800/50 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white">Data Layer</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {['PostgreSQL', 'Drizzle', 'Next.js 14'].map((tag) => (
              <span key={tag} className="px-2 py-1 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* --- Card 5: Stats / Gamification (Wide) --- */}
        <div className="md:col-span-2 md:row-span-1 relative group rounded-xl border border-slate-800 bg-slate-900/50 hover:border-pink-500/50 transition-all duration-300 flex items-center overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-pink-500/10 to-transparent pointer-events-none" />
          
          <div className="p-6 flex items-center justify-between w-full">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-pink-400" />
                <h3 className="font-bold text-white">System Tracking</h3>
              </div>
              <p className="text-sm text-slate-400">Total media entities indexed.</p>
            </div>
            
            <div className="text-right">
              <span className="text-3xl font-mono font-bold text-white tracking-tighter">1,204</span>
              <p className="text-[10px] uppercase tracking-widest text-slate-500">Entities</p>
            </div>
          </div>
        </div>

         {/* --- Card 6: Expandable Architecture --- */}
         <div className="md:col-span-2 md:row-span-1 relative rounded-xl border border-slate-800 bg-slate-900/50 p-6 hover:bg-slate-800/30 transition-colors">
            <div className="flex items-start gap-4">
                <div className="p-2 bg-slate-800 rounded border border-slate-700">
                    <Layers className="w-5 h-5 text-slate-300" />
                </div>
                <div>
                    <h3 className="font-bold text-white text-sm mb-1">Modular Architecture</h3>
                    <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                        Features are loosely coupled. New modules (scrapers, APIs, tools) can be hot-swapped without affecting core stability.
                    </p>
                </div>
            </div>
        </div>

      </div>
    </section>
  );
};

export default BentoGrid;