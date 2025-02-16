'use client'
import { useRef } from 'react'
import { useMusicStore } from './music-context';
import { MusicPlayer } from './music-player';

import { MdClear } from "react-icons/md";
import { FaFilter } from "react-icons/fa";
import { MusicList } from './components/music-list';
import { PlaylistView } from './components/playlist';

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
    <div className="w-full " style={{ height: `calc(100svh - ${70}px)` }}>
      <div id="desktop-layout" className="relative border border-black w-full flex h-[90%]">
        <div id="sidebar" className="absolute md:static bg-[#082635]  top-0 bottom-0 transition-transform duration-300 w-full md:w-[300px] h-full -translate-x-full md:translate-x-0">
          <div className='flex flex-col gap-4 w-full px-1 sm:px-2 py-4'>
            <input ref={filterRef} type="text" placeholder="Enter title" className="w-full text-black rounded-3xl px-4 py-2 outline-none" />
            <div className='flex w-full justify-center gap-4'>
              <button className='bg-black hover:bg-green-700 text-white px-3 py-2 rounded-lg' onClick={clearFilter}>
                  <MdClear />
                </button>
              <button className='bg-black hover:bg-green-700 text-white px-3 py-2 rounded-lg' onClick={applyFilter}>
                  <FaFilter />
                </button>
            </div>
          </div>
         <PlaylistView list={list}/> 
        </div>
        <MusicList musicPromise={music} />
      </div>
      <div id="music-player" className="border h-[10%]">
        <MusicPlayer />
      </div>
    </div>
  )
}