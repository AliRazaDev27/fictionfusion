"use client"
import { MdMoreHoriz } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { forwardRef, useRef } from "react";
import { Music } from "@/lib/database/musicSchema";

interface MusicCardProps {
  music: Music;
  index: number;
  current: (index: number) => void;
  currentMusic: number;
  handleSearch: (searchTerm: string, musicId: number) => Promise<void>
}
export const MusicCard = forwardRef<HTMLDivElement, MusicCardProps>(({ music, index, current, currentMusic, handleSearch}, ref) =>{
  const metadataSearchContainerRef = useRef<HTMLDivElement>(null);
  const metadataSearchInputRef = useRef<HTMLInputElement>(null);
  const searchTermInput = () => {
    if (metadataSearchContainerRef.current && metadataSearchInputRef.current) {
      metadataSearchContainerRef.current.style.display = "flex"
    }
  }
  const performSearch = ()=>{
    if (metadataSearchInputRef.current) {
      handleSearch(metadataSearchInputRef.current.value,music.id)
      if (metadataSearchContainerRef.current) {
        metadataSearchContainerRef.current.style.display = "none"
      }
    }
  }
  const showDetails = ()=>{
    // do something
  }
  return (
    <div ref={ref} className='flex gap-2 overflow-hidden text-white font-semibold text-xl px-2 py-2 border-2 hover:bg-blue-700 border-blue-500 cursor-pointer rounded-xl' style={{ backgroundColor: index === currentMusic ? "rgba(0, 122, 255, 1)" : "" }} key={music.id} onClick={() => current(index)}>
      <div className='shrink-0 w-[100px] h-[100px] rounded-3xl overflow-hidden border'>
        <img src={music.coverArt || `/music-player.png`} alt="cover-art" className='w-full h-full object-cover' />
      </div>
      <div className='flex flex-col gap-2'>
        <p>{music.title}</p>
        <p>{music.artist || "Unknown"}</p>
        <div className='flex gap-4'>
          <button className='bg-black hover:bg-green-600 text-white p-2 rounded-full' onClick={showDetails}>
            <MdMoreHoriz className='size-5' />
          </button>
          <button className='bg-black hover:bg-green-600 text-white p-2 rounded-full' onClick={searchTermInput}>
            <IoSearch className='size-5' />
          </button>
        </div>
      </div>

      <div ref={metadataSearchContainerRef} className='hidden items-center justify-center bg-black/80 absolute top-0 bottom-0 right-0 left-0 cursor-not-allowed '>
        <div className="rounded-3xl px-4 py-4 space-y-4 w-[450px] bg-[#194566]">
        <input ref={metadataSearchInputRef} type="text" defaultValue={music.title}  className='w-full text-black rounded-3xl px-4 py-2' />
        <div className='flex justify-center gap-4 '>
          <button className='rounded-3xl bg-black text-white px-4 py-2'
            onClick={
              () => {
                if (metadataSearchContainerRef.current) {
                  metadataSearchContainerRef.current.style.display = "none"
                }
              }}
          >Cancel</button>
          <button className='rounded-3xl bg-black text-white px-4 py-2'
          onClick={performSearch}
          >Search</button>
        </div>

      </div>
</div>
    </div>
  )
})
MusicCard.displayName = "MusicCard";