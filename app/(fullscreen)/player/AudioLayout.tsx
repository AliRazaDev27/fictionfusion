"use client";
import React, { useEffect, useState, useRef } from 'react';
import {
  Server,
  Wifi,
  FolderOpen,
  Search,
  Plus,
  Filter,
  ListMusic,
  Maximize2,
  Menu, // New import
  X     // New import
} from 'lucide-react';
import ActiveMediaPanel from './ActiveMediaPanel';
import PlayerDeck from './PlayerDeck';
import TrackRow from './track-row';
import { useMusicStore } from '@/app/(main)/music/music-context';
import { Music } from '@/lib/database/musicSchema';
import { VisualizerProvider } from './VisualizerContext';
import VisualizerCanvas from './VisualizerCanvas';
import { List } from '@/lib/database/listSchema';

interface AudioLayoutProps {
  children?: React.ReactNode;
  initialMusic: Music[];
  initialPlaylists: List[];
}

const AudioLayout = ({ children, initialMusic, initialPlaylists }: AudioLayoutProps) => {
  const {
    playlist,
    music,
    fullMusicList,
    current,
    addMusic,
    addPlaylist,
    setFullMusicList,
    setCurrent,
    filterMusicList,
    clearFilter
  } = useMusicStore((state: any) => state);

  const [cachedTracks, setCachedTracks] = useState<Set<number>>(new Set());
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'LOCAL'>('ALL'); // Filters
  const [visibleCount, setVisibleCount] = useState(20);

  const [showMobileMenu, setShowMobileMenu] = useState(false); // New State

  // Zen Mode
  const [zenMode, setZenMode] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTrigger = useRef<HTMLDivElement>(null);

  // Store hydration
  useEffect(() => {
    if (initialMusic) {
      addMusic(initialMusic);
      setFullMusicList(initialMusic);
    }
    if (initialPlaylists) {
      addPlaylist(initialPlaylists);
    }
  }, [initialMusic, initialPlaylists]);

  // Check for cached files
  useEffect(() => {
    const checkCache = async () => {
      try {
        if (!fullMusicList) return;
        const cache = await window.caches.open("cloudinary-media");
        const cachedIds = new Set<number>();

        await Promise.all(fullMusicList.map(async (track: Music) => {
          if (track.fileUrlPublic) {
            const match = await cache.match(track.fileUrlPublic);
            if (match) cachedIds.add(track.id);
          }
        }));
        setCachedTracks(cachedIds);
      } catch (e) {
        console.error("Cache check failed", e);
      }
    };

    checkCache();
  }, [fullMusicList]);


  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount(prev => Math.min(prev + 8, music?.length || 0));
      }
    }, { threshold: 0.1, rootMargin: '100px' });

    if (scrollTrigger.current) {
      observer.observe(scrollTrigger.current);
    }

    return () => observer.disconnect();
  }, [music, visibleCount]);

  // Reset infinite scroll when list changes
  useEffect(() => {
    setVisibleCount(8);
  }, [music]);


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    if (term) {
      filterMusicList(term);
    } else {
      applySourceFilter(activeFilter);
    }
  };

  const handlePlaylistClick = (listId: number) => {
    const selectedList = playlist.find((l: List) => l.id === listId);
    if (selectedList && fullMusicList) {
      const filtered = fullMusicList.filter((m: Music) => selectedList.items.includes(m.id));
      addMusic(filtered);
      setActiveFilter('ALL'); // Reset Source filter when picking playlist
    }
  };

  const applySourceFilter = (type: 'ALL' | 'LOCAL') => {
    setActiveFilter(type);
    if (type === 'ALL') {
      clearFilter(); // Shows fullMusicList (or handleSearch if we want to combine, but let's keep simple)
    } else {
      if (fullMusicList) {
        const localOnly = fullMusicList.filter((m: Music) => cachedTracks.has(m.id));
        addMusic(localOnly);
      }
    }
  }

  const showAllMusic = () => {
    applySourceFilter('ALL');
  }

  return (
    <VisualizerProvider>
      <div className="flex h-screen w-screen bg-slate-950 text-slate-400 font-mono overflow-hidden selection:bg-cyan-900 selection:text-cyan-200">

        {/* --- MOBILE SIDEBAR BACKDROP --- */}
        {showMobileMenu && (
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setShowMobileMenu(false)}
          />
        )}

        {/* --- LEFT DOCK: SOURCES & LIBRARY (260px) --- */}
        {!zenMode && (
          <aside className={`
              fixed inset-y-0 left-0 z-50 w-[260px] flex flex-col border-r border-slate-800 bg-slate-950 transition-transform duration-300 ease-in-out md:static md:translate-x-0
              ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'}
          `}>

            {/* App Title / Home Button */}
            <div className="h-14 flex items-center px-4 border-b border-slate-800 justify-between">
              <div className="flex items-center gap-2 text-slate-100 font-bold tracking-tight">
                <div className="w-3 h-3 bg-emerald-500 rounded-sm animate-pulse"></div>
                AUDIO_NODE
              </div>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="md:hidden text-slate-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ... (Rest of sidebar) ... */}

            {/* Connection Status (PWA Flex) */}
            <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/30">
              <div className="flex justify-between items-center text-[10px] uppercase tracking-wider mb-2">
                <span>Connection</span>
                <span className="text-emerald-500">Secure</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div
                  onClick={() => applySourceFilter('ALL')}
                  className={`flex items-center gap-2 p-1.5 border rounded text-xs cursor-pointer transition-colors ${activeFilter === 'ALL' ? 'bg-cyan-950/30 border-cyan-500/50 text-cyan-400' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'} `}
                >
                  <Server className="w-3 h-3 text-cyan-500" />
                  <span>Cloud</span>
                </div>
                <div
                  onClick={() => applySourceFilter('LOCAL')}
                  className={`flex items-center gap-2 p-1.5 border rounded text-xs cursor-pointer transition-colors ${activeFilter === 'LOCAL' ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'} `}
                >
                  <Wifi className="w-3 h-3 text-emerald-500" />
                  <span>Local</span>
                </div>
              </div>
            </div>

            {/* Navigation / Folders */}
            <nav className="flex-1 overflow-y-auto p-2 space-y-6">
              {/* ... Content ... */}
              {/* Section: Input */}
              <div>
                <h3 className="px-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">// INPUT_SOURCES</h3>
                <ul className="space-y-0.5">
                  <li
                    onClick={() => { applySourceFilter('LOCAL'); setShowMobileMenu(false); }}
                    className={`group flex items-center gap-3 px-2 py-2 rounded cursor-pointer transition-colors ${activeFilter === 'LOCAL' ? 'bg-slate-900 text-white' : 'hover:bg-slate-900 hover:text-white'} `}
                  >
                    <FolderOpen className="w-4 h-4 text-amber-500" />
                    <span className="text-sm">Local Files</span>
                    <span className="ml-auto text-[10px] bg-slate-800 px-1.5 rounded text-slate-500 group-hover:text-slate-300">
                      {cachedTracks.size}
                    </span>
                  </li>
                  <li
                    onClick={() => { applySourceFilter('ALL'); setShowMobileMenu(false); }}
                    className={`group flex items-center gap-3 px-2 py-2 rounded cursor-pointer transition-colors ${activeFilter === 'ALL' ? 'bg-slate-900 text-white' : 'hover:bg-slate-900 hover:text-white'} `}
                  >
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
                  {playlist && playlist.length > 0 ? (
                    playlist.map((list: List, idx: number) => (
                      <li
                        key={list.id || idx}
                        onClick={() => { handlePlaylistClick(list.id); setShowMobileMenu(false); }}
                        className="flex items-center gap-3 px-2 py-2 hover:bg-slate-900 hover:text-cyan-400 rounded cursor-pointer group"
                      >
                        <ListMusic className="w-4 h-4 text-slate-600 group-hover:text-cyan-500" />
                        <span className="text-sm truncate">{list.listName}</span>
                        <span className="ml-auto text-[10px] text-slate-600">{list.items?.length || 0}</span>
                      </li>
                    ))
                  ) : (
                    <li className="px-2 py-2 text-xs text-slate-600">No signals detected...</li>
                  )}
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
        )}


        {/* --- MAIN TERMINAL: TRACK MATRIX (Flex-1) --- */}
        <main className="flex-1 flex flex-col min-w-0 bg-black/20">

          {/* Top Bar: Search & Filter */}
          <header className="h-14 border-b border-slate-800 flex items-center px-4 justify-between bg-slate-950/80 backdrop-blur gap-4">

            {/* Mobile Menu Button */}
            {!zenMode && (
              <button
                onClick={() => setShowMobileMenu(true)}
                className="md:hidden p-2 -ml-2 text-slate-500 hover:text-white"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div className="flex items-center gap-3 flex-1 md:w-96 md:flex-none bg-slate-900/50 border border-slate-800 rounded px-3 py-1.5 focus-within:border-cyan-500/50 transition-colors">
              <Search className="w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Query Database..."
                onChange={handleSearch}
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-600 text-slate-200"
              />
            </div>

            <div className="flex gap-2">
              <button className="p-2 hover:bg-slate-800 rounded text-slate-500 hover:text-white border border-transparent hover:border-slate-700">
                <Filter className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZenMode(!zenMode)}
                className={`p-2 rounded text-slate-500 hover:text-white border border-transparent hover:border-slate-700 transition-colors ${zenMode ? 'text-cyan-400 bg-slate-900' : ''}`}
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </header>

          {zenMode ? (
            <div className="flex-1 w-full h-full relative bg-black flex flex-col items-center justify-center overflow-hidden">
              {/* Giant Visualizer */}
              <div className="absolute inset-0">
                <VisualizerCanvas width={undefined} height={undefined} className="w-full h-full opacity-100" />
              </div>

              {/* Minimal Track Info */}
              <div className="relative z-10 text-center space-y-2 pointer-events-none">
                <h1 className="text-4xl font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                  {music && music[current]?.title}
                </h1>
                <p className="text-xl text-cyan-400 font-mono tracking-widest">
                  {music && music[current]?.artist}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* The Track Table Header */}
              <div className="grid grid-cols-[50px_1fr_40px] md:grid-cols-[40px_60px_1fr_120px_80px_80px] px-4 py-2 border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-950/30">
                <div className="hidden md:block text-center">#</div>
                <div className="md:hidden text-center">ART</div>
                <div className="hidden md:block text-center">ART</div>
                <div>Title / Identity</div>
                <div className="hidden md:block">Artist</div>
                <div className="hidden md:block text-right">Album</div>
                <div className="text-right">Action</div>
                <div className="hidden md:block text-right">Time</div>
              </div>

              {/* The Content Area */}
              <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                {/* ... */}
                {music && music.length > 0 ? (
                  <>
                    {music.slice(0, visibleCount).map((track: Music, index: number) => (
                      <div key={track.id} onClick={() => setCurrent(index)}>
                        <TrackRow
                          index={index + 1}
                          title={track.title}
                          artist={track.artist}
                          album={track?.album || ""}
                          duration={track.duration || "00:00"}
                          bitrate="320kbps"
                          format={track.fileUrlPrivate?.endsWith('.flac') ? 'FLAC' : 'MP3'}
                          source={cachedTracks.has(track.id) ? 'LOCAL' : 'CLOUD'}
                          isPlaying={current === index}
                          coverImage={track.coverArt || undefined}
                          audioSrc={track.fileUrlPublic || undefined}
                        />
                      </div>
                    ))}
                    {visibleCount < music.length && (
                      <div ref={scrollTrigger} className="h-10 w-full flex items-center justify-center text-slate-700 text-xs animate-pulse">
                        LOADING_DATA...
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-8 text-center text-slate-600 font-mono">
                    NO DATA AVAILABLE
                  </div>
                )}
              </div>
            </>
          )}

          {/* --- BOTTOM DECK: CONTROLS (90px) --- */}
          <div className="h-24 border-t border-slate-800 bg-slate-950 flex flex-col relative z-20">
            <PlayerDeck />
          </div>
        </main>
        {!zenMode && (
          <aside>
            <ActiveMediaPanel />
          </aside>
        )}
      </div>
    </VisualizerProvider>
  );
};

export default AudioLayout;