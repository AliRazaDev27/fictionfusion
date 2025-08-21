'use client'
import { useRef } from 'react'
import { useMusicStore } from './music-context';
import { MusicPlayer } from './music-player';
import { PlaylistView } from './components/playlist';
import { MusicList } from './components/music-list';
import { MdAdd, MdClear } from "react-icons/md";
import { FaFilter } from "react-icons/fa";
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { FaArrowAltCircleDown } from "react-icons/fa";
import { Music } from "@/lib/database/musicSchema"


export function MusicPlayerLayoutComponent({ music, list }) {
  const filterMusicList = useMusicStore((state: any) => state.filterMusicList)
  const _clearFilter = useMusicStore((state: any) => state.clearFilter)
  const filterRef = useRef<HTMLInputElement>(null)

  const addMusic = useMusicStore((state: any) => state.addMusic);
  const fullMusicList = useMusicStore((state: any) => state.fullMusicList)

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
  const filterDownloaded = async () => {
    const cacheButton = document.getElementById('filterCacheButton') as HTMLButtonElement
    if (!cacheButton) return
    cacheButton.disabled = true;
    try {
      const cache = await window.caches.open("cloudinary-media");
      const checks = await Promise.all(
        fullMusicList.map(async (music) => {
          const response = await cache.match(music.fileUrlPublic!);
          return { music, exists: !!response };
        })
      );
      // filter based on resolved results
      const filtered = checks
        .filter((item) => item.exists)
        .map((item) => item.music);
      addMusic(filtered)
    }
    catch (e) {
      console.log(e)
    }
    finally {
      cacheButton.disabled = false;
    }
  }
  return (
    <div className="w-full relative" style={{ height: `calc(100svh - ${70}px)` }}>
      <div id="desktop-layout" className="relative  w-full flex h-[90%]">
        <div id="sidebar" className="bg-stone-900 absolute z-10 md:static top-0 bottom-0 transition-transform duration-300 w-full md:w-[250px] h-full  -translate-x-full md:translate-x-0">
          <div className='flex flex-col gap-3 w-full px-1 sm:px-2 py-4'>
            <Input ref={filterRef} type="text" placeholder="Enter title" />
            <div className='flex w-full justify-center gap-2'>
              <Link href="/music/add" prefetch={false} className='bg-slate-700 cursor-pointer hover:bg-green-700 text-white px-3 py-2 rounded-lg'>
                <MdAdd />
              </Link>
              <button
                id={`filterCacheButton`}
                onClick={filterDownloaded}
                className='bg-slate-700 cursor-pointer hover:bg-green-700 text-white px-3 py-2 rounded-lg'>
                <FaArrowAltCircleDown />
              </button>
              <button className='bg-slate-700 cursor-pointer hover:bg-green-700 text-white px-3 py-2 rounded-lg' onClick={clearFilter}>
                <MdClear />
              </button>
              <button className='bg-slate-700 cursor-pointer hover:bg-green-700 text-white px-3 py-2 rounded-lg' onClick={applyFilter}>
                <FaFilter />
              </button>
            </div>
          </div>
          <PlaylistView list={list} />
        </div>
        <MusicList musicPromise={music} />
      </div>
      <div id="music-player" className="h-[10%]">
        <MusicPlayer />
      </div>
    </div>
  )
}