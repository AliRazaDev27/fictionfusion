"use client";
import React from 'react';
import { 
  Github, 
  Twitter, 
  Mail, 
  GitBranch, 
  Globe, 
  Clock, 
  ArrowUpRight,
  Cpu 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 font-sans text-slate-400 pt-16 pb-0 relative overflow-hidden">
      
      {/* Top Section: Main Navigation & Info */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        
        {/* Col 1: Brand / Mission */}
        <div className="col-span-1 md:col-span-1 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
             <div className="w-2 h-2 bg-cyan-500 rounded-sm"></div>
             FictionFusion
          </div>
          <p className="text-sm leading-relaxed text-slate-500">
            A personal entertainment operating system.
            <br/>
            Optimized for offline use, data ownership, and automated discovery.
          </p>
          
          {/* Social / External Links */}
          <div className="flex gap-4 pt-2">
            <a href="https://github.com/yourusername" target="_blank" rel="noreferrer" className="p-2 bg-slate-900 rounded border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-400 transition-all">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 bg-slate-900 rounded border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-400 transition-all">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="mailto:you@example.com" className="p-2 bg-slate-900 rounded border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-400 transition-all">
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Col 2: Directory (Navigation) */}
        <div>
          <h3 className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 inline-block">
            // DIRECTORY
          </h3>
          <ul className="space-y-2 font-mono text-sm">
            {['dashboard', 'music', 'movies', 'books', 'scrapers'].map((item) => (
              <li key={item}>
                <a href={`/${item}`} className="group flex items-center gap-2 hover:text-cyan-400 transition-colors">
                  <span className="text-slate-600 group-hover:text-cyan-600">~/</span>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Tech Specs (Portfolio Flex) */}
        <div>
          <h3 className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 inline-block">
            // DEPENDENCIES
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between items-center group">
              <span>Framework</span>
              <span className="font-mono text-xs text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 group-hover:border-cyan-500/30">Next.js 16</span>
            </li>
            <li className="flex justify-between items-center group">
              <span>Database</span>
              <span className="font-mono text-xs text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 group-hover:border-cyan-500/30">Postgres</span>
            </li>
            <li className="flex justify-between items-center group">
              <span>Styling</span>
              <span className="font-mono text-xs text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 group-hover:border-cyan-500/30">Tailwind</span>
            </li>
            <li className="flex justify-between items-center group">
              <span>Media</span>
              <span className="font-mono text-xs text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 group-hover:border-cyan-500/30">Cloudinary</span>
            </li>
          </ul>
        </div>

        {/* Col 4: Resources */}
        <div>
          <h3 className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 border-b border-slate-800 pb-2 inline-block">
            // RESOURCES
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="flex items-center gap-1 hover:text-emerald-400 transition-colors">
                Changelog <ArrowUpRight className="w-3 h-3 opacity-50" />
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-1 hover:text-emerald-400 transition-colors">
                Documentation <ArrowUpRight className="w-3 h-3 opacity-50" />
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-1 hover:text-emerald-400 transition-colors">
                API Status <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-1 animate-pulse"></span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* SYSTEM STATUS BAR (The "IDE" Bottom Bar) */}
      <div className="w-full bg-black/40 border-t border-slate-800 py-1.5 px-4 md:px-6 flex flex-wrap justify-between items-center text-[10px] md:text-xs font-mono text-slate-500 select-none">
        
        {/* Left Side: Git & Env */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 hover:text-slate-300 cursor-help transition-colors">
            <GitBranch className="w-3 h-3" />
            <span>main</span>
          </div>
          <div className="items-center gap-1.5 hidden sm:flex">
            <div className="w-2 h-2 rounded-full border border-slate-600"></div>
            <span>0 errors</span>
          </div>
          <div className="items-center gap-1.5 hidden sm:flex">
             <Cpu className="w-3 h-3" />
             <span>heap: 42mb</span>
          </div>
        </div>

        {/* Center: Copyright (Subtle) */}
        <div className="hidden md:block opacity-50">
          © 2023 FictionFusion Labs. All nodes active.
        </div>

        {/* Right Side: Deployment Info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-emerald-500/80">
            <Globe className="w-3 h-3" />
            <span>Vercel Edge</span>
          </div>
          <div className="flex items-center gap-1.5 hover:text-slate-300 cursor-pointer">
            <Clock className="w-3 h-3" />
            <span>12ms</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-slate-600">{`{ }`}</span>
            <span>TypeScript</span>
          </div>
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px] pointer-events-none"></div>

    </footer>
  );
};

export default Footer;