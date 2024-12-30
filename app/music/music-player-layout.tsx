'use client'
import { useState, useRef } from 'react'
import { useToast } from '@/components/ui/use-toast';
import PlaylistContext from './music-context';
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




export function MusicPlayerLayoutComponent({ music, list }) {
  const [musicList, setMusicList] = useState<Music[] | undefined>(music);
  const [playlist, setPlaylist] = useState(list)
  //rather than direct array index, maybe use the music.id instead?
  const [currentMusic, setCurrentMusic] = useState<number>(0);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [searchResults, setSearchResults] = useState<any>([]);
  // no idea what this is for maybe refactor to make it obvious.
  const searchIndexRef = useRef<number>(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const filterRef = useRef<HTMLInputElement>(null)
  const selected = useRef<number[]>([])
  const { toast } = useToast()
  const current = (id: number) => {
    setCurrentMusic(id)
  }
  const next = () => {
    if (!musicList) return
    const nextIndex = (currentMusic + 1) % musicList.length;
    setCurrentMusic(nextIndex);
    cardRefs.current[nextIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
  const prev = () => {
    if (!musicList) return
    const prevIndex = (currentMusic - 1 + musicList.length) % musicList.length
    setCurrentMusic(prevIndex);
    cardRefs.current[prevIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
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
  const updateMusic = async (music: any) => {
    if (!musicList) return
    if (searchContainerRef.current) searchContainerRef.current.style.display = "none"
    const { artistName, artworkUrl100, collectionName, releaseDate, trackName, trackTimeMillis } = music
    const result = await updateMusicMetadata(searchIndexRef.current, { artistName, artworkUrl100, collectionName, releaseDate, trackName, trackTimeMillis })
    if (result.success) {
      const index = musicList.findIndex((music: Music) => music.id === searchIndexRef.current)
      if (result.data && result.data[0]) {
        if (musicList?.length) {
          setMusicList((musicList) => musicList!.map((music: Music) => music.id === searchIndexRef.current ? result.data[0] : music))
        }
      }
    }
    else {
      toast({
        title: "Error Updating Metadata",
        description: result.message,
        className: "bg-red-600 text-white",
        duration: 2000
      })
    }

  }
  const applyFilter = () => {
    const title = filterRef.current?.value
    if (!title) return
    const filtered = music.filter((music: Music) => music.title.toLowerCase().includes(title.toLowerCase()))
    setMusicList(filtered)
  }

  const clearFilter = () => {
    if (filterRef.current) filterRef.current.value = "";
    setMusicList(music);
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
  async function saveToPlaylist(id: number) {
    // start with easist solution
    if (selected.current && selected.current.length > 0) {
      const result = await addToPlaylist(id, selected.current)
      if (result?.success && result.items) {
        toast({
          title: "Success",
          description: "Added to playlist",
          className: "bg-green-600 text-white",
          duration: 1500
        })
        const thisList = list.find((list) => list.id === id)
        thisList.items = result.items
        const updatedPlaylist = list.map((list) => list.id === id ? thisList : list)
        setPlaylist(updatedPlaylist)
      }
      else {
        toast({
          title: "Error",
          description: result?.message,
          className: "bg-red-600 text-white",
          duration: 1500
        })
      }
    }
  }
  async function deleteFromPlaylist(id: number) {
    if (selected.current && selected.current.length > 0) {
      const result = await removeFromPlaylist(id, selected.current)
      if (result?.success && result.items) {
        toast({
          title: "Success",
          description: "Removed from playlist",
          className: "bg-green-600 text-white",
          duration: 1500
        })
        const thisList = list.find((list) => list.id === id)
        thisList.items = result.items
        const updatedPlaylist = list.map((list) => list.id === id ? thisList : list)
        setPlaylist(updatedPlaylist)
      }
      else {
        toast({
          title: "Error",
          description: result?.message,
          className: "bg-red-600 text-white",
          duration: 1500
        })
      }
    }
  }
  function loadPlaylist(id: number) {
    const playlist = list.find((list) => list.id === id)
    const filtered = music.filter((music: Music) => playlist?.items?.includes(music.id))
    if (filtered.length > 0) setMusicList(filtered)
  }


  return (
    <PlaylistContext.Provider value={playlist}>
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
            <div id="playlists" className='flex flex-col gap-4 w-full px-2 sm:px-4 py-4'>
              <div className='flex justify-between items-center'>
                <p className='text-xl font-medium text-white'>Playlists</p>
                <div className='flex items-center gap-2'>
                  <CreatePlaylist addPlaylist={setPlaylist} />
                  <button className='bg-black hover:bg-green-700 border border-green-700 text-white px-2 py-2 rounded-full' onClick={() => {
                    selected.current = []
                    const selectionElement = document.querySelectorAll('.selection-box')
                    selectionElement.forEach((element: any) => {
                      element.classList.toggle('hidden')
                      element.checked = false
                    })
                  }}>
                    <BiSolidSelectMultiple className='size-6' />
                  </button>
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                {
                  playlist && playlist.length > 0 && playlist.map((playlist: any, index: number) => (
                    <div key={index} className='w-full ps-4 flex items-center justify-between'>
                      <button
                       className='bg-black hover:scale-105 shadow shadow-black text-white px-4 py-2 rounded-xl'
                        onClick={(event) => {
                          loadPlaylist(playlist.id)
                          const playlistButtons = document.querySelectorAll('.playlist-toggle')
                          playlistButtons.forEach((button: any) => button.classList.remove('playlist-toggle'));
                          (event.target as HTMLElement).classList.toggle('playlist-toggle')
                        }}
                      ><p>{playlist.listName} - <span className='font-light text-sm'>{playlist.items.length}</span></p></button>
                      <div className='flex gap-2 items-center'>
                        <button className='bg-black hover:bg-green-700 border border-green-700 text-white px-2 py-2 rounded-full'
                          onClick={() => deleteFromPlaylist(playlist.id)}>
                          <MdDelete className='size-6' />
                        </button>

                        <button className='bg-black hover:bg-green-700 border border-green-700 text-white px-2 py-2 rounded-full'
                          onClick={() => saveToPlaylist(playlist.id)}>
                          <FaSave className='size-6' />
                        </button>

                      </div>
                    </div>
                  ))
                }
              </div>
            </div>


          </div>
          <div id="content" className="w-full md:border-l px-4 flex-1 space-y-4 pt-4  overflow-y-auto overflow-x-clip">
            {musicList && musicList.length > 0 && musicList.map((music: Music, index: number) => (
              <div key={index} className='w-full  flex  items-center gap-4'>
                <Input type="checkbox" value={music.id} onChange={() => handleSelection(music.id)} className='size-5 shrink-0 selection-box hidden' />
                <MusicCard ref={(el) => { cardRefs.current[index] = el }} music={music} index={index} current={current} currentMusic={currentMusic} handleSearch={handleSearch} />
              </div>
            ))}
          </div>
        </div>
        <div id="music-player" className=" border h-[10%]">
          <MusicPlayer musicSource={musicList && musicList[currentMusic]?.fileUrlPublic || ""} next={next} prev={prev} metadata={musicList && musicList[currentMusic] || { title: "", artist: "", coverArt: "" }}/>
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
                      <button className='w-max px-2 py-1 bg-green-600 hover:bg-green-700  rounded-3xl'
                        onClick={() => {
                          updateMusic(music)
                        }}
                      >Update Info</button>
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
    </PlaylistContext.Provider>
  )
}

type Metadata = {
  title: string;
  artist: string;
  coverArt: string | null;
}
