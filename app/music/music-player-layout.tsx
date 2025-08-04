'use client'
import { useRef } from 'react'
import { useMusicStore } from './music-context';
import { MusicPlayer } from './music-player';
import { PlaylistView } from './components/playlist';
import { MusicList } from './components/music-list';
import { MdClear } from "react-icons/md";
import { FaFilter } from "react-icons/fa";
import { Input } from '@/components/ui/input';
import { AddMusicFile } from './add-music-file';

export function MusicPlayerLayoutComponent({ music, list }) {
  const filterMusicList = useMusicStore((state: any) => state.filterMusicList)
  const _clearFilter = useMusicStore((state: any) => state.clearFilter)
  const filterRef = useRef<HTMLInputElement>(null)
  const applyFilter = () => {
    const title = filterRef.current?.value
    if (!title) return
    filterMusicList(title)
  }
  const clearFilter = () => {
    if (filterRef.current) filterRef.current.value = "";
    _clearFilter()
    const playlistButtons = document.querySelectorAll('.playlist-toggle')
    playlistButtons.forEach((button: any) => button.classList.remove('playlist-toggle'))
  }

  return (
    <div className="w-full" style={{ height: `calc(100svh - ${70}px)` }}>
      <div id="desktop-layout" className="relative bg-slate-950 w-full flex h-[90%]">
        <div id="sidebar" className="absolute md:static top-0 bottom-0 transition-transform duration-300 w-full md:w-[250px] h-full -translate-x-full md:translate-x-0">
          <div className='flex flex-col gap-4 w-full px-1 sm:px-2 py-4'>
            <Input ref={filterRef} type="text" placeholder="Enter title" />
            <div className='flex w-full justify-center gap-4'>
              <AddMusicFile />
              <button className='bg-slate-700 cursor-pointer hover:bg-green-700 text-white px-3 py-2 rounded-lg' onClick={clearFilter}>
                  <MdClear />
                </button>
              <button className='bg-slate-700 cursor-pointer hover:bg-green-700 text-white px-3 py-2 rounded-lg' onClick={applyFilter}>
                  <FaFilter />
                </button>
            </div>
          </div>
         <PlaylistView list={list}/> 
        </div>
        <MusicList musicPromise={music} />
      </div>
      <div id="music-player" className="h-[10%]">
        <MusicPlayer />
      </div>
    </div>
  )
}