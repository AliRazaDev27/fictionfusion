"use client";
import React, { useState, useRef, useEffect } from 'react';
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
   ListMusic,
   Repeat1
} from 'lucide-react';
import { useMusicStore } from '@/app/(main)/music/music-context';
import { useVisualizer } from './VisualizerContext';
import EqualizerModal from './EqualizerModal';

const PlayerDeck = () => {
   const { music, current, setCurrent } = useMusicStore((state: any) => state);
   const { initializeAudio } = useVisualizer();
   const currentTrack = music && music[current];

   const [isPlaying, setIsPlaying] = useState(false);
   const [showEq, setShowEq] = useState(false);
   const [volume, setVolume] = useState(75);
   const [progress, setProgress] = useState(0);
   const [currentTime, setCurrentTime] = useState(0);
   const [duration, setDuration] = useState(0);

   // Playback Modes
   const [isShuffle, setIsShuffle] = useState(false);
   const [repeatMode, setRepeatMode] = useState<'OFF' | 'ALL' | 'ONE'>('OFF'); // OFF -> ALL -> ONE -> OFF

   const audioRef = useRef<HTMLAudioElement | null>(null);

   // Visual helper for the volume blocks
   const volumeBlocks = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

   useEffect(() => {
      if (currentTrack && audioRef.current) {
         // Only update source if it changed to avoid reloading same track
         if (audioRef.current.src !== currentTrack.fileUrlPublic) {
            audioRef.current.src = currentTrack.fileUrlPublic || "";
         }

         if (isPlaying) {
            audioRef.current.play().catch(e => console.log("Autoplay blocked", e));
         }
         // Init Visualizer immediately
         initializeAudio(audioRef.current);
      }
   }, [currentTrack]);

   // Volume Effect
   useEffect(() => {
      if (audioRef.current) {
         audioRef.current.volume = volume / 100;
      }
   }, [volume])

   const togglePlay = () => {
      if (audioRef.current) {
         if (isPlaying) {
            audioRef.current.pause();
         } else {
            audioRef.current.play();
         }
         setIsPlaying(!isPlaying);
      }
   };

   const toggleShuffle = () => {
      setIsShuffle(!isShuffle);
   };

   const toggleRepeat = () => {
      if (repeatMode === 'OFF') setRepeatMode('ALL');
      else if (repeatMode === 'ALL') setRepeatMode('ONE');
      else setRepeatMode('OFF');
   }

   const handleTimeUpdate = () => {
      if (audioRef.current) {
         const curr = audioRef.current.currentTime;
         const dur = audioRef.current.duration;
         setCurrentTime(curr);
         setDuration(dur);
         if (dur > 0) {
            setProgress((curr / dur) * 100);
         }
      }
   };

   const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
      const bar = e.currentTarget;
      const rect = bar.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      if (audioRef.current && Number.isFinite(audioRef.current.duration)) {
         audioRef.current.currentTime = percentage * audioRef.current.duration;
      }
   }

   const playNext = () => {
      if (music.length > 0) {
         let nextIndex;
         if (repeatMode === 'ONE') {
            // Manual next skips even in Repeat One, unless pure logic override desired.
            // Standard UX: Next button forces next track. Auto-play repeats.
            // However, let's keep it simple: If Shuffle ON -> Random. Else -> Next.
            if (isShuffle) {
               nextIndex = Math.floor(Math.random() * music.length);
            } else {
               nextIndex = (current + 1) % music.length;
            }
         } else if (isShuffle) {
            nextIndex = Math.floor(Math.random() * music.length);
         } else {
            nextIndex = (current + 1) % music.length;
         }

         setCurrent(nextIndex);
         setIsPlaying(true);
      }
   }

   const playPrev = () => {
      if (music.length > 0) {
         let prevIndex;
         if (isShuffle) {
            prevIndex = Math.floor(Math.random() * music.length);
         } else {
            prevIndex = (current - 1 + music.length) % music.length;
         }
         setCurrent(prevIndex);
         setIsPlaying(true);
      }
   }

   const handleEnded = () => {
      if (repeatMode === 'ONE') {
         if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
         }
      } else {
         playNext();
      }
   }

   // MediaSession API Integration
   useEffect(() => {
      if (!currentTrack) return;

      if ('mediaSession' in navigator) {
         navigator.mediaSession.metadata = new MediaMetadata({
            title: currentTrack.title,
            artist: currentTrack.artist,
            album: currentTrack.album || "Unknown Album",
            artwork: [
               { src: currentTrack.coverArt || "/music-player.png", sizes: '96x96', type: 'image/jpeg' },
               { src: currentTrack.coverArt || "/music-player.png", sizes: '256x256', type: 'image/jpeg' },
            ]
         });

         const handlePlay = () => {
            if (audioRef.current) {
               audioRef.current.play();
               setIsPlaying(true);
            }
         };

         const handlePause = () => {
            if (audioRef.current) {
               audioRef.current.pause();
               setIsPlaying(false);
            }
         };

         const handleSeekTo = (details: MediaSessionActionDetails) => {
            if (audioRef.current && details.seekTime !== undefined) {
               audioRef.current.currentTime = details.seekTime;
            }
         };

         navigator.mediaSession.setActionHandler('play', handlePlay);
         navigator.mediaSession.setActionHandler('pause', handlePause);
         navigator.mediaSession.setActionHandler('previoustrack', playPrev);
         navigator.mediaSession.setActionHandler('nexttrack', playNext);
         navigator.mediaSession.setActionHandler('seekto', handleSeekTo);
      }

      return () => {
         if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler('play', null);
            navigator.mediaSession.setActionHandler('pause', null);
            navigator.mediaSession.setActionHandler('previoustrack', null);
            navigator.mediaSession.setActionHandler('nexttrack', null);
            navigator.mediaSession.setActionHandler('seekto', null);
         }
      }
   }, [currentTrack, playNext, playPrev]);


   const formatTime = (time: number) => {
      if (!time || isNaN(time)) return "00:00";
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
   };

   const formatTimeSubtitle = (time: number) => {
      if (!time || isNaN(time)) return ".00";
      const ms = Math.floor((time % 1) * 100);
      return `.${ms.toString().padStart(2, '0')}`;
   }

   return (
      <div className="h-24 w-full bg-slate-950 border-t border-slate-800 flex items-center justify-between px-2 md:px-6 relative">
         <audio
            ref={audioRef}
            crossOrigin="anonymous"
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            onError={(e) => console.log("Audio Error", e)}
         />

         {/* Background Texture (Subtle Grid) */}
         <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(#22d3ee 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
         </div>

         {/* --- LEFT SECTOR: TIMECODE & META (Hidden on Mobile) --- */}
         <div className="hidden lg:flex w-[200px] items-center gap-4 relative z-10">
            {/* Time Display (LED Style) */}
            <div className="bg-black/50 border border-slate-800 px-3 py-1 rounded-sm font-mono text-cyan-500 text-lg tracking-widest shadow-[0_0_10px_rgba(6,182,212,0.15)]">
               {formatTime(currentTime)}<span className="text-slate-600 text-xs">{formatTimeSubtitle(currentTime)}</span>
            </div>
            <div className="text-[10px] font-mono text-slate-500 flex flex-col">
               <span>TOTAL: {formatTime(duration)}</span>
               <span className="text-emerald-500">SYNC: {currentTrack ? "OK" : "IDLE"}</span>
            </div>
         </div>


         {/* --- CENTER SECTOR: TRANSPORT & SCRUBBER --- */}
         <div className="flex-1 max-w-2xl flex flex-col gap-2 items-center relative z-10 px-2">

            {/* 1. The Scrubber (Segmented LED Bar) */}
            <div className="w-full flex items-center gap-3 group">
               <span className="text-[10px] font-mono text-slate-600 group-hover:text-cyan-500 transition-colors hidden md:block">
                  {currentTime > 0 ? "-" + formatTime(duration - currentTime) : "00:00"}
               </span>

               {/* Mobile Time (Current) */}
               <span className="text-[10px] font-mono text-slate-500 md:hidden">
                  {formatTime(currentTime)}
               </span>

               <div
                  onClick={handleSeek}
                  className="relative flex-1 h-3 bg-slate-900 border border-slate-800 rounded-sm cursor-pointer overflow-hidden"
               >
                  {/* The Fill */}
                  <div
                     className="absolute top-0 left-0 h-full bg-cyan-600/80 transition-all duration-100"
                     style={{ width: `${progress}%` }}
                  ></div>

                  {/* The Segment Overlay (Creates the 'Blocks' look) */}
                  <div className="absolute inset-0 w-full h-full pointer-events-none"
                     style={{ background: 'repeating-linear-gradient(90deg, transparent 0, transparent 2px, #020617 2px, #020617 4px)' }}>
                  </div>

                  {/* The "Head" Indicator */}
                  <div className="absolute top-0 h-full w-0.5 bg-white shadow-[0_0_10px_white] pointer-events-none" style={{ left: `${progress}%` }}></div>
               </div>

               <span className="text-[10px] font-mono text-slate-600 group-hover:text-cyan-500 transition-colors">{formatTime(duration)}</span>
            </div>

            {/* 2. Transport Buttons (Hardware Feel) */}
            <div className="flex items-center gap-1">

               <button
                  onClick={toggleShuffle}
                  className={`w-8 h-8 flex items-center justify-center rounded-sm border border-transparent hover:border-slate-700 hover:bg-slate-900 transition-all ${isShuffle ? 'text-cyan-400 bg-slate-900 shadow-[0_0_5px_rgba(6,182,212,0.3)]' : 'text-slate-500 hover:text-cyan-400'}`}
               >
                  <Shuffle className="w-3 h-3" />
               </button>

               {/* Main Cluster */}
               <div className="flex items-center gap-0.5 bg-slate-900 border border-slate-800 rounded-sm p-0.5">
                  <button onClick={playPrev} className="w-10 h-8 flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border-r border-slate-800">
                     <SkipBack className="w-4 h-4 fill-current" />
                  </button>

                  <button
                     onClick={togglePlay}
                     className={`w-12 h-8 flex items-center justify-center hover:bg-slate-800 transition-colors ${isPlaying ? 'text-cyan-400' : 'text-white'}`}
                  >
                     {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                  </button>

                  <button onClick={playNext} className="w-10 h-8 flex items-center justify-center hover:bg-slate-800 text-slate-400 hover:text-white transition-colors border-l border-slate-800">
                     <SkipForward className="w-4 h-4 fill-current" />
                  </button>
               </div>

               <button
                  onClick={toggleRepeat}
                  className={`w-8 h-8 flex items-center justify-center rounded-sm border border-transparent hover:border-slate-700 hover:bg-slate-900 transition-all ${repeatMode !== 'OFF' ? 'text-cyan-400 bg-slate-900 shadow-[0_0_5px_rgba(6,182,212,0.3)]' : 'text-slate-500 hover:text-cyan-400'}`}
               >
                  {repeatMode === 'ONE' ? <Repeat1 className="w-3 h-3" /> : <Repeat className="w-3 h-3" />}
               </button>
            </div>
         </div>


         {/* --- RIGHT SECTOR: OUTPUT / GAIN (Hidden on Mobile) --- */}
         <div className="hidden lg:flex w-[200px] items-center justify-end gap-6 relative z-10">

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
                        className={`w-1.5 h-4 rounded-[1px] transition-all ${volume >= level
                           ? 'bg-cyan-500 shadow-[0_0_5px_rgba(6,182,212,0.5)]'
                           : 'bg-slate-800 group-hover:bg-slate-700'
                           }`}
                     ></div>
                  ))}
               </div>
            </div>

            {/* Extra Options */}
            <div className="flex gap-1 border-l border-slate-800 pl-4 relative">
               <button
                  onClick={() => setShowEq(!showEq)}
                  className={`p-2 rounded-sm transition-colors ${showEq ? 'text-cyan-400 bg-slate-900' : 'text-slate-500 hover:text-white hover:bg-slate-900'}`}
               >
                  <Settings2 className="w-4 h-4" />
               </button>

               {showEq && <EqualizerModal onClose={() => setShowEq(false)} />}

               <button className="p-2 text-slate-500 hover:text-white hover:bg-slate-900 rounded-sm lg:hidden">
                  <ListMusic className="w-4 h-4" />
               </button>
            </div>

         </div>
      </div>
   );
};

export default PlayerDeck;