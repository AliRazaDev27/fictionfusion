'use client'
import { useState, useRef, use, Suspense } from 'react'
import { useToast } from '@/components/ui/use-toast';
import { useMusicStore } from './music-context';
import { updateMusicMetadata } from '@/actions/musicActions';
import { addToPlaylist, removeFromPlaylist } from '@/actions/playlistActions';
import { Music } from "@/lib/database/musicSchema";
import { MusicPlayer } from './music-player';
import { MusicCard } from './music-card';
import { AddMusicFile } from './add-music-file';
import CreatePlaylist from './create-playlist';

import { Input } from '@/components/ui/input';
import { BiSolidSelectMultiple } from "react-icons/bi";
import { MdClear, MdDelete } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import { FaFilter } from "react-icons/fa";
import { IoPlay } from "react-icons/io5";
import { IoPause } from "react-icons/io5";
import { IoIosCloseCircle } from "react-icons/io";
import { List } from '@/lib/database/listSchema';
import { MusicList } from './components/music-list';
import { PlaylistView } from './components/playlist';




export function MusicPlayerLayoutComponent({ music, list }) {
  const filterMusicList = useMusicStore((state: any) => state.filterMusicList)
  const _clearFilter = useMusicStore((state: any) => state.clearFilter)
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [searchResults, setSearchResults] = useState<any>([]);
  const searchIndexRef = useRef<number>(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const filterRef = useRef<HTMLInputElement>(null)
  const selected = useRef<number[]>([])
  const { toast } = useToast()
  const handleSearch = async (searchTerm: string, id: number) => {
    const title = encodeURIComponent(searchTerm)
    const result = await fetch(`https://itunes.apple.com/search?term=${title}`)
    const response = await result.json()
    if (response.resultCount === 0) {
      toast({
        title: "No Results Found, Try Different Search Term",
        className: "bg-red-600 text-white",
        duration: 1500
      })
      return;
    }
    if (searchContainerRef.current) {
      searchContainerRef.current.style.display = "block"
    }
    searchIndexRef.current = id
    setSearchResults(response.results)
  }
  // const updateMusic = async (music: any) => {
  //   if (!musicList) return
  //   if (searchContainerRef.current) searchContainerRef.current.style.display = "none"
  //   const { artistName, artworkUrl100, collectionName, releaseDate, trackName, trackTimeMillis } = music
  //   const result = await updateMusicMetadata(searchIndexRef.current, { artistName, artworkUrl100, collectionName, releaseDate, trackName, trackTimeMillis })
  //   if (result.success) {
  //     const index = musicList.findIndex((music: Music) => music.id === searchIndexRef.current)
  //     if (result.data && result.data[0]) {
  //       if (musicList?.length) {
  //         setMusicList((musicList) => musicList!.map((music: Music) => music.id === searchIndexRef.current ? result.data[0] : music))
  //       }
  //     }
  //   }
  //   else {
  //     toast({
  //       title: "Error Updating Metadata",
  //       description: result.message,
  //       className: "bg-red-600 text-white",
  //       duration: 2000
  //     })
  //   }
  // }
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

  const handleSelection = (id) => {
    if (selected.current.includes(id)) {
      selected.current = selected.current.filter((item) => item !== id)
    }
    else {
      selected.current = [...selected.current, id]
    }
  }


  return (
    <div className="w-full " style={{ height: `calc(100svh - ${70}px)` }}>
      <div id="desktop-layout" className="relative border border-black w-full flex h-[90%]">
        <div id="sidebar" className="absolute md:static bg-[#082635]  top-0 bottom-0 transition-transform duration-300 w-full md:w-[300px] h-full -translate-x-full md:translate-x-0">
          <div className='flex flex-col gap-4 w-full px-1 sm:px-2 py-4'>
            <input ref={filterRef} type="text" placeholder="Enter title" className="w-full text-black rounded-3xl px-4 py-2 outline-none" />
            <div className='flex w-full justify-center gap-4'>
              <div>
                <AddMusicFile />
              </div>
              <button className='bg-black hover:bg-green-700 text-white px-3 py-2 rounded-lg' onClick={clearFilter}>
                  <MdClear />
                </button>
              <button className='bg-black hover:bg-green-700 text-white px-3 py-2 rounded-lg' onClick={applyFilter}>
                  <FaFilter />
                </button>
            </div>
          </div>

         <PlaylistView list={list} selected={selected}/> 


        </div>
        <MusicList musicPromise={music} handleSearch={handleSearch} handleSelection={handleSelection} />

      </div>
      <div id="music-player" className="border h-[10%]">
        <MusicPlayer />
      </div>
      <div id="metadata-search" className='fixed bg-emerald-900 top-0 bottom-0 left-0 right-0 w-full md:w-[600px] mx-auto ' style={{ display: "none" }} ref={searchContainerRef}>
        <div className='absolute text-xl text-black hover:text-red-600 font-extrabold top-3 right-8 cursor-pointer' onClick={(e) => { if (searchContainerRef.current) searchContainerRef.current.style.display = "none" }}>
          <IoIosCloseCircle className='size-8' />
        </div>
        <div className='w-full border text-white border-white h-screen overflow-y-auto flex flex-col'>
          {
            searchResults && searchResults.map((music: any, index: number) => (
              <div className='flex items-center border gap-2 p-2' key={index}>
                <div className='min-w-[100px] aspect-square'>
                  <img src={music.artworkUrl100} alt="artwork" style={{ objectFit: "cover" }} loading='lazy' width={100} height={100} />
                </div>
                <div className='flex flex-col gap-1'>
                  <p className='text-xl'>{music.trackName}</p>
                  <p className='text-lg'>{music.artistName}</p>
                  <p className='text-lg'>{music.releaseDate && music.releaseDate.split("T")[0]}</p>
                  <div className='flex gap-4'>
                    {/* <button className='w-max px-2 py-1 bg-green-600 hover:bg-green-700  rounded-3xl'
                        onClick={() => {
                          updateMusic(music)
                        }}
                      >Update Info</button> */}
                    <button
                      className='w-max bg-black hover:bg-green-600 p-2 rounded-full'
                      onClick={
                        () => {
                          const player = document.getElementById(`samplePlayer-${index}`) as HTMLAudioElement;
                          const play = document.getElementById(`samplePlay-${index}`) as HTMLAudioElement;
                          const pause = document.getElementById(`samplePause-${index}`) as HTMLAudioElement;
                          if (player && play && pause) {
                            if (player.paused) {
                              player.play();
                              play.style.display = "none";
                              pause.style.display = "block";
                            } else {
                              player.pause();
                              play.style.display = "block";
                              pause.style.display = "none";
                            }
                          }
                        }
                      }
                    >
                      <IoPlay id={`samplePlay-${index}`} />
                      <IoPause id={`samplePause-${index}`} style={{ display: "none" }} />
                    </button>
                    <audio id={`samplePlayer-${index}`} src={music.previewUrl || null} preload='none'>Audio Player not supported</audio>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

type Metadata = {
  title: string;
  artist: string;
  coverArt: string | null;
}
