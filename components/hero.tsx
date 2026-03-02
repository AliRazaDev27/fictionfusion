"use client";
import React, { useState, useEffect } from 'react';
import { ChevronRight, Terminal, Cpu, Zap, Github } from 'lucide-react';

const HeroSection = () => {
  const [bootStep, setBootStep] = useState(0);
  
  // Simulation of a boot sequence for the "Live Log"
  const bootLogs = [
    { id: 1, text: "INITIALIZING_CORE...", status: "OK", color: "text-green-500" },
    { id: 2, text: "CONNECTING_DB [PostgreSQL]", status: "CONNECTED", color: "text-blue-500" },
    { id: 3, text: "LOADING_AI_MODEL [Gemini Pro]", status: "READY", color: "text-indigo-500" },
    { id: 4, text: "CHECKING_PWA_CACHE", status: "SYNCED", color: "text-emerald-500" },
    { id: 5, text: "MOUNTING_UI_COMPONENTS...", status: "DONE", color: "text-slate-400" },
  ];

  useEffect(() => {
    if (bootStep < bootLogs.length) {
      const timer = setTimeout(() => {
        setBootStep(prev => prev + 1);
      }, 600); // Speed of the "boot" animation
      return () => clearTimeout(timer);
    }
  }, [bootStep]);

  return (
    <section className="relative w-full pt-20 pb-12 overflow-hidden bg-slate-950 font-sans selection:bg-cyan-500/30">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>
      
      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-cyan-500/10 blur-[100px] rounded-full z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT COLUMN: The Hook */}
        <div className="space-y-6">
          
          {/* Version Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">System Online v2.4</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
            Fiction<span className="text-cyan-500">Fusion</span>
            <span className="block text-2xl md:text-3xl text-slate-500 font-mono mt-2 font-normal">
              // PERSONAL_MEDIA_OS
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
            A centralized command center for tracking books, movies, and music. 
            Built for <b>offline utility</b>, powered by <b>AI</b>, and engineered for <b>personal use</b>.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button className="group relative px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-mono rounded overflow-hidden transition-all">
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
              <span className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4" />
                INITIALIZE_SESSION
              </span>
            </button>
            
            <a href="#" className="px-6 py-3 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 rounded font-mono flex items-center gap-2 transition-all">
              <Github className="w-4 h-4" />
              VIEW_SOURCE
            </a>
          </div>

          {/* Tech Stack Mini-Bar */}
          <div className="pt-8 flex items-center gap-6 text-slate-600">
             <div className="flex items-center gap-2 text-xs font-mono uppercase">
                <Cpu className="w-4 h-4" /> Next.js 14
             </div>
             <div className="flex items-center gap-2 text-xs font-mono uppercase">
                <Zap className="w-4 h-4" /> PWA Enabled
             </div>
             <div className="flex items-center gap-2 text-xs font-mono uppercase">
                <Terminal className="w-4 h-4" /> Drizzle ORM
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: The "System Monitor" */}
        <div className="hidden lg:block relative">
          <div className="relative rounded-lg bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
               <div className="flex gap-1.5">
                 <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
               </div>
               <div className="text-[10px] font-mono text-slate-500">root@fiction-fusion:~</div>
            </div>

            {/* Terminal Content */}
            <div className="p-6 font-mono text-sm h-[320px] flex flex-col">
              {bootLogs.map((log, index) => (
                <div 
                  key={log.id} 
                  className={`flex justify-between mb-2 transition-opacity duration-300 ${index < bootStep ? 'opacity-100' : 'opacity-0'}`}
                >
                  <span className="text-slate-300">{`> ${log.text}`}</span>
                  <span className={`${log.color}`}>{`[${log.status}]`}</span>
                </div>
              ))}
              
              {/* Blinking Cursor at the end */}
              {bootStep === bootLogs.length && (
                <div className="mt-4 text-cyan-500 animate-pulse">
                  _ WAITING FOR USER INPUT...
                </div>
              )}
            </div>
            
            {/* Decorative Scanline */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none animate-scan"></div>
          </div>
          
          {/* Decorative Back Elements */}
          <div className="absolute -z-10 -right-4 -bottom-4 w-full h-full border border-slate-800 rounded-lg opacity-50"></div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;