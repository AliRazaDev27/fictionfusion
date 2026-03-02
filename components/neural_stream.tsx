import React from 'react';
import { Play, BookOpen, Tv, Search, Clock, MoreHorizontal } from 'lucide-react';

const NeuralStream = () => {
  // Mock data based on your real interests
  const recentItems = [
    {
      id: 1,
      type: 'NOVEL',
      title: 'Reverend Insanity',
      meta: 'Ch. 2340 • Gu Zhen Ren',
      progress: 88,
      status: 'READING',
      icon: <BookOpen className="w-3 h-3 text-cyan-400" />,
      image: '/api/placeholder/150/220', // Replace with actual cover
      last_active: '2m ago'
    },
    {
      id: 2,
      type: 'SHOW',
      title: 'Banshee',
      meta: 'S03 E05 • Tribal',
      progress: 45,
      status: 'WATCHING',
      icon: <Tv className="w-3 h-3 text-pink-400" />,
      image: '/api/placeholder/150/220',
      last_active: '2h ago'
    },
    {
      id: 3,
      type: 'MUSIC',
      title: 'Night on the Galactic Railroad',
      meta: 'Joe Hisaishi • Local File',
      progress: 100, // playing
      status: 'PLAYING',
      icon: <Play className="w-3 h-3 text-emerald-400" />,
      image: '/api/placeholder/150/220',
      last_active: 'Now'
    },
    {
      id: 4,
      type: 'NOVEL',
      title: 'Lord of the Mysteries',
      meta: 'Vol 2 • The Clown',
      progress: 12,
      status: 'QUEUED',
      icon: <BookOpen className="w-3 h-3 text-cyan-400" />,
      image: '/api/placeholder/150/220',
      last_active: '1d ago'
    },
    {
      id: 5,
      type: 'SHOW',
      title: 'Spartacus',
      meta: 'S01 E01 • The Red Serpent',
      progress: 0,
      status: 'ARCHIVED',
      icon: <Tv className="w-3 h-3 text-slate-400" />,
      image: '/api/placeholder/150/220',
      last_active: '3d ago'
    }
  ];

  return (
    <section className="bg-slate-950 py-8 border-b border-slate-900 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* The Command Bar Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
          <div>
            <h3 className="text-sm font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">
              // RECENT_INGEST_STREAM
            </h3>
            <div className="relative group w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-12 py-2 border border-slate-800 rounded bg-slate-900 text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 font-mono transition-all"
                placeholder="Query database or paste URL..."
                readOnly 
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <kbd className="hidden md:inline-block px-1.5 py-0.5 border border-slate-700 rounded text-[10px] font-mono text-slate-500 bg-slate-800">
                  CTRL K
                </kbd>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 text-[10px] font-mono text-slate-600">
             <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span> READING</span>
             <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span> WATCHING</span>
             <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> LISTENING</span>
          </div>
        </div>

        {/* The Horizontal Stream */}
        <div className="relative">
          {/* Fade Gradients for scroll hint */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none"></div>

          <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-hide">
            {recentItems.map((item) => (
              <div 
                key={item.id} 
                className="flex-none w-64 snap-center group relative bg-slate-900/40 border border-slate-800 rounded hover:border-slate-600 transition-all hover:bg-slate-800/60 cursor-pointer overflow-hidden"
              >
                 {/* Card Content Layout */}
                 <div className="flex h-24">
                    {/* Poster Section (Left) */}
                    <div className="w-16 h-full bg-slate-800 relative flex-shrink-0">
                        {/* Placeholder for image - in real app use <img src={item.image} /> */}
                        <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-slate-600 text-xs font-mono">
                           IMG
                        </div>
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/40"></div>
                    </div>

                    {/* Metadata Section (Right) */}
                    <div className="p-3 flex flex-col justify-between flex-grow min-w-0">
                        <div>
                            <div className="flex justify-between items-start">
                                <span className={`text-[10px] font-mono px-1.5 rounded border ${
                                    item.type === 'NOVEL' ? 'border-cyan-900 text-cyan-500 bg-cyan-950/30' :
                                    item.type === 'SHOW' ? 'border-pink-900 text-pink-500 bg-pink-950/30' :
                                    'border-emerald-900 text-emerald-500 bg-emerald-950/30'
                                }`}>
                                    {item.type}
                                </span>
                                <MoreHorizontal className="w-4 h-4 text-slate-600 hover:text-white" />
                            </div>
                            <h4 className="text-sm font-bold text-slate-200 mt-1 truncate group-hover:text-white transition-colors">
                                {item.title}
                            </h4>
                            <p className="text-xs text-slate-500 truncate font-mono">
                                {item.meta}
                            </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full mt-2">
                             <div className="flex justify-between text-[10px] text-slate-600 mb-1 font-mono">
                                 <span>{item.status}</span>
                                 <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {item.last_active}
                                 </span>
                             </div>
                             <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                 <div 
                                    className={`h-full rounded-full ${
                                        item.type === 'NOVEL' ? 'bg-cyan-500' :
                                        item.type === 'SHOW' ? 'bg-pink-500' :
                                        'bg-emerald-500'
                                    }`} 
                                    style={{ width: `${item.progress}%` }}
                                 ></div>
                             </div>
                        </div>
                    </div>
                 </div>
              </div>
            ))}
            
            {/* "Add New" Ghost Card */}
            <div className="flex-none w-24 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded hover:border-cyan-500/50 hover:bg-cyan-950/10 transition-all cursor-pointer group">
               <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <span className="text-xl text-slate-500 group-hover:text-cyan-400">+</span>
               </div>
               <span className="text-[10px] font-mono text-slate-600 uppercase">Add Entry</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NeuralStream;