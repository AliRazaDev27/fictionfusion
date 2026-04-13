import React from 'react';
import { Play, MoreHorizontal, HardDrive, Cloud, Disc, Download } from 'lucide-react';

interface TrackProps {
  index: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  bitrate: string;
  format: 'MP3' | 'FLAC' | 'WAV';
  source: 'LOCAL' | 'CLOUD';
  isPlaying?: boolean;
  coverImage?: string; // Added this prop
  audioSrc?: string;
}

const TrackRow = ({
  index,
  title,
  artist,
  album,
  duration,
  bitrate,
  format,
  source,
  isPlaying = false,
  coverImage,
  audioSrc
}: TrackProps) => {

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioSrc) return;

    try {
      const cache = await window.caches.open("cloudinary-media");
      await cache.add(audioSrc);
      console.log('Added to cache:', audioSrc);
    } catch (error) {
      console.error('Failed to add to cache:', error);
    }
  };

  return (
    // Changed Grid: Responsive - Mobile: [Thumb] [Info] [Action] | Desktop: [Index] [Thumb] [Info] [Source] [Specs] [Action]
    <div className={`group grid grid-cols-[50px_1fr_40px] md:grid-cols-[40px_60px_1fr_120px_80px_80px] px-2 md:px-4 py-2 border-b border-slate-800/50 hover:bg-slate-900/80 transition-all cursor-pointer items-center ${isPlaying ? 'bg-slate-900 border-l-2 border-l-cyan-500' : 'border-l-2 border-l-transparent'}`}>

      {/* 1. Index / Play State (Hidden on Mobile) */}
      <div className="hidden md:flex justify-center text-xs font-mono text-slate-600">
        {isPlaying ? (
          <div className="flex gap-0.5 items-end h-3">
            <div className="w-1 bg-cyan-500 animate-[bounce_1s_infinite] h-2"></div>
            <div className="w-1 bg-cyan-500 animate-[bounce_1.2s_infinite] h-3"></div>
            <div className="w-1 bg-cyan-500 animate-[bounce_0.8s_infinite] h-1"></div>
          </div>
        ) : (
          <span className="group-hover:hidden">{String(index).padStart(2, '0')}</span>
        )}
        <Play className="hidden group-hover:block w-3 h-3 text-white absolute" />
      </div>

      {/* 2. THE THUMBNAIL (Media Cartridge Style) */}
      <div className="flex justify-center pr-2 md:pr-3">
        <div className={`relative w-10 h-10 border ${isPlaying ? 'border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'border-slate-700 group-hover:border-slate-500'} bg-slate-800 transition-all`}>
          {coverImage ? (
            <img src={coverImage} alt="Cover" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-900">
              <Disc className="w-4 h-4 text-slate-700" />
            </div>
          )}

          {/* Tech Overlay: Scanline or Gloss */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-white/5 pointer-events-none"></div>
        </div>
      </div>

      {/* 3. Track Identity */}
      <div className="flex flex-col min-w-0 pr-2 md:pr-4">
        <span className={`text-sm font-bold truncate ${isPlaying ? 'text-cyan-400' : 'text-slate-300 group-hover:text-white'}`}>
          {title}
        </span>
        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
          <span className="truncate max-w-[150px]">{artist}</span>
          <span className="hidden md:inline text-slate-700">•</span>
          <span className="hidden md:inline truncate max-w-[150px] text-slate-600">{album}</span>
        </div>
      </div>

      {/* 4. Source & Format (Hidden on Mobile) */}
      <div className="hidden md:flex flex-col justify-center items-start gap-1">
        <div className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded border text-[9px] font-mono uppercase tracking-wider ${source === 'LOCAL'
          ? 'border-emerald-900/50 bg-emerald-950/20 text-emerald-500'
          : 'border-blue-900/50 bg-blue-950/20 text-blue-500'
          }`}>
          {source === 'LOCAL' ? <HardDrive className="w-2.5 h-2.5" /> : <Cloud className="w-2.5 h-2.5" />}
          {source}
        </div>
      </div>

      {/* 5. Tech Specs (Hidden on Mobile) */}
      <div className="hidden md:flex text-right font-mono text-[10px] text-slate-500 flex-col justify-center">
        <span className="text-slate-400">{format}</span>
        <span className="opacity-50">{bitrate}</span>
      </div>

      {/* 6. Duration / Actions */}
      <div className="flex items-center justify-end gap-3 text-xs font-mono text-slate-500">
        <span className="hidden md:inline group-hover:hidden">{duration}</span>
        <div className="flex items-center gap-1 md:hidden md:group-hover:flex">
          <button
            onClick={handleDownload}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
            title="Download to Cache"
          >
            <Download className="w-4 h-4" />
          </button>
          <button className="hidden md:block p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};

export default TrackRow;