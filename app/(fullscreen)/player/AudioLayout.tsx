import React from 'react';
import { 
  Server, 
  Wifi, 
  WifiOff, 
  Disc, 
  FolderOpen, 
  Search, 
  Plus, 
  Filter, 
  Mic2,
  ListMusic,
  Maximize2
} from 'lucide-react';
import ActiveMediaPanel from './ActiveMediaPanel';
import PlayerDeck from './PlayerDeck';

// This wrapper replaces your current <div className="h-[calc(100svh-70px)]">
const AudioLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-400 font-mono overflow-hidden selection:bg-cyan-900 selection:text-cyan-200">
      
      {/* --- LEFT DOCK: SOURCES & LIBRARY (260px) --- */}
      <aside className="w-[260px] flex flex-col border-r border-slate-800 bg-slate-950/50">
        
        {/* App Title / Home Button */}
        <div className="h-14 flex items-center px-4 border-b border-slate-800">
           <div className="flex items-center gap-2 text-slate-100 font-bold tracking-tight">
             <div className="w-3 h-3 bg-emerald-500 rounded-sm animate-pulse"></div>
             AUDIO_NODE
           </div>
        </div>

        {/* Connection Status (PWA Flex) */}
        <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/30">
          <div className="flex justify-between items-center text-[10px] uppercase tracking-wider mb-2">
            <span>Connection</span>
            <span className="text-emerald-500">Secure</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-slate-300">
               <Server className="w-3 h-3 text-cyan-500" />
               <span>Cloud</span>
            </div>
            <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-slate-300">
               <Wifi className="w-3 h-3 text-emerald-500" />
               <span>Local</span>
            </div>
          </div>
        </div>

        {/* Navigation / Folders */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-6">
          
          {/* Section: Input */}
          <div>
            <h3 className="px-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">// INPUT_SOURCES</h3>
            <ul className="space-y-0.5">
              <li className="group flex items-center gap-3 px-2 py-2 hover:bg-slate-900 hover:text-white rounded cursor-pointer transition-colors">
                <FolderOpen className="w-4 h-4 text-amber-500" />
                <span className="text-sm">Local Files</span>
                <span className="ml-auto text-[10px] bg-slate-800 px-1.5 rounded text-slate-500 group-hover:text-slate-300">12</span>
              </li>
              <li className="group flex items-center gap-3 px-2 py-2 hover:bg-slate-900 hover:text-white rounded cursor-pointer transition-colors">
                <Server className="w-4 h-4 text-cyan-500" />
                <span className="text-sm">Cloud Library</span>
              </li>
            </ul>
          </div>

          {/* Section: Playlists (Frequency Channels) */}
          <div>
            <div className="px-2 flex justify-between items-center mb-2">
               <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">// FREQUENCY_CHANNELS</h3>
               <button className="text-slate-600 hover:text-white"><Plus className="w-3 h-3" /></button>
            </div>
            <ul className="space-y-0.5">
              {['Coding Flow', 'Night Drive', 'High BPM', 'OST Collection'].map((list) => (
                <li key={list} className="flex items-center gap-3 px-2 py-2 hover:bg-slate-900 hover:text-cyan-400 rounded cursor-pointer group">
                  <ListMusic className="w-4 h-4 text-slate-600 group-hover:text-cyan-500" />
                  <span className="text-sm truncate">{list}</span>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Storage Health (Footer of Sidebar) */}
        <div className="p-4 border-t border-slate-800">
           <div className="flex justify-between text-[10px] mb-1">
              <span>CACHE_STORAGE</span>
              <span>45%</span>
           </div>
           <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 w-[45%]"></div>
           </div>
        </div>
      </aside>


      {/* --- MAIN TERMINAL: TRACK MATRIX (Flex-1) --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-black/20">
        
        {/* Top Bar: Search & Filter */}
        <header className="h-14 border-b border-slate-800 flex items-center px-4 justify-between bg-slate-950/80 backdrop-blur">
           <div className="flex items-center gap-3 w-96 bg-slate-900/50 border border-slate-800 rounded px-3 py-1.5 focus-within:border-cyan-500/50 transition-colors">
              <Search className="w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Query Database..." 
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-600 text-slate-200"
              />
           </div>
           
           <div className="flex gap-2">
              <button className="p-2 hover:bg-slate-800 rounded text-slate-500 hover:text-white border border-transparent hover:border-slate-700">
                 <Filter className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-slate-800 rounded text-slate-500 hover:text-white border border-transparent hover:border-slate-700">
                 <Maximize2 className="w-4 h-4" />
              </button>
           </div>
        </header>

        {/* The Track Table Header */}
        <div className="grid grid-cols-[40px_1fr_120px_80px_80px] px-4 py-2 border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-950/30">
           <div className="text-center">#</div>
           <div>Title / Identity</div>
           <div>Artist</div>
           <div className="text-right">Bitrate</div>
           <div className="text-right">Time</div>
        </div>

        {/* The Content Area (Where your `children` go) */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
           {children}
        </div>
        
        {/* --- BOTTOM DECK: CONTROLS (90px) --- */}
        <div className="h-24 border-t border-slate-800 bg-slate-950 flex flex-col relative z-20">
           {/* We will build the Player Control separately next */}
             <PlayerDeck/>
        </div>
      </main>
              <aside>
                <ActiveMediaPanel />
              </aside>
    </div>
  );
};

export default AudioLayout;