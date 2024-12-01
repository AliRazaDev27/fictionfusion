"use client"
import { MdMoreHoriz } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { forwardRef, useRef } from "react";
import { Music } from "@/lib/database/musicSchema";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoEye } from "react-icons/io5";
import { deleteMusic } from "@/actions/musicActions";
import { useToast } from "./ui/use-toast";


interface MusicCardProps {
  music: Music;
  index: number;
  current: (index: number) => void;
  currentMusic: number;
  handleSearch: (searchTerm: string, musicId: number) => Promise<void>
}
export const MusicCard = forwardRef<HTMLDivElement, MusicCardProps>(({ music, index, current, currentMusic, handleSearch }, ref) => {
  const metadataSearchContainerRef = useRef<HTMLDivElement>(null);
  const metadataSearchInputRef = useRef<HTMLInputElement>(null);
  const {toast} = useToast()
  const searchTermInput = () => {
    if (metadataSearchContainerRef.current && metadataSearchInputRef.current) {
      metadataSearchContainerRef.current.style.display = "flex"
    }
  }
  const performSearch = () => {
    if (metadataSearchInputRef.current) {
      handleSearch(metadataSearchInputRef.current.value, music.id)
      if (metadataSearchContainerRef.current) {
        metadataSearchContainerRef.current.style.display = "none"
      }
    }
  }
  const deleteItem = async() => {
    try{
    const result = await deleteMusic(music.id)
    if(result.success){
      toast({
        title:"Music Item Deleted Successfully",
        className:"bg-green-600 text-white",
        duration:1500
      })
    }
    }
    catch(err:any){
      toast({
        title:"Failed to Delete Music Item",
        description:err.message,
        className:"bg-red-600 text-white",
        duration:1500
      })
    }
  }
  return (
    <div ref={ref} className='flex gap-2 overflow-hidden text-white font-semibold text-xl px-2 py-2 border-2 hover:bg-blue-700 border-blue-500 cursor-pointer rounded-xl' style={{ backgroundColor: index === currentMusic ? "rgba(0, 122, 255, 1)" : "" }} key={music.id} onClick={() => current(index)}>
      <div className='shrink-0 w-[100px] h-[100px] rounded-3xl overflow-hidden'>
        <img src={music.coverArt || `/music-player.png`} alt="cover-art" className='w-full h-full object-cover' width={100} height={100}/>
      </div>
      <div className='flex flex-col gap-2'>
        <p>{music.title}</p>
        <p>{music.artist || "Unknown"}</p>
        <div className='flex gap-4'>
          <button className='bg-black hover:bg-green-600 text-white p-2 rounded-full' popoverTarget={`music-card-actions-popover-${music.id}`}>
            <MdMoreHoriz className='size-5' />
          </button>
          <button className='bg-black hover:bg-green-600 text-white p-2 rounded-full' onClick={searchTermInput}>
            <IoSearch className='size-5' />
          </button>
          <div id={`music-card-actions-popover-${music.id}`} className="music-card-actions-popover" popover="auto">
            <button className="bg-gray-700 hover:bg-gray-800 p-3 rounded-xl">
              <IoEye className='size-6' />
            </button>
            <button className="bg-gray-700 hover:bg-gray-800 p-3 rounded-xl">
              <MdEdit className='size-6' />
            </button>
            <button className="bg-gray-700 hover:bg-gray-800 p-3 rounded-xl">
              <MdDelete className='size-6' onClick={deleteItem} />
            </button>
          </div>
        </div>
      </div>

      <div ref={metadataSearchContainerRef} className='hidden items-center justify-center bg-black/80 absolute top-0 bottom-0 right-0 left-0 cursor-not-allowed '>
        <div className="rounded-3xl px-4 py-4 space-y-4 w-[450px] bg-[#194566]">
          <input ref={metadataSearchInputRef} type="text" defaultValue={music.title} className='w-full text-black rounded-3xl px-4 py-2' />
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