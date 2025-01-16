"use client"
import { MdMoreHoriz } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { forwardRef , useRef } from "react";
import { Music } from "@/lib/database/musicSchema";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoEye } from "react-icons/io5";
import { deleteMusic } from "@/actions/musicActions";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useMusicStore } from "./music-context";
import Image from "next/image";


interface MusicCardProps {
  music: Music;
  index: number;
  handleSearch: (searchTerm: string, musicId: number) => Promise<void>
}
export const MusicCard = forwardRef<HTMLDivElement, MusicCardProps>(({ music, index, handleSearch }, ref) => {
  const currentMusic = useMusicStore((state: any) => state.current)
  const current = useMusicStore((state: any) => state.setCurrent)

  const metadataSearchContainerRef = useRef<HTMLDivElement>(null);
  const metadataSearchInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast()


  const searchTermInput = (e: any) => {
    e.stopPropagation()
    if (metadataSearchContainerRef.current && metadataSearchInputRef.current) {
      metadataSearchContainerRef.current.style.display = "flex"
    }
  }
  const performSearch = (e: any) => {
    e.stopPropagation()
    if (metadataSearchInputRef.current) {
      handleSearch(metadataSearchInputRef.current.value, music.id)
      if (metadataSearchContainerRef.current) {
        metadataSearchContainerRef.current.style.display = "none"
      }
    }
  }
  const deleteItem = async (e:any) => {
    e.stopPropagation()
    try {
      const result = await deleteMusic(music.id)
      if (result.success) {
        toast({
          title: "Music Item Deleted Successfully",
          className: "bg-green-600 text-white",
          duration: 1500
        })
        const element = document.getElementById(`music-card-${music.id}`)
        if (element) {
          element.remove()
        }
      }
    }
    catch (err: any) {
      toast({
        title: "Failed to Delete Music Item",
        description: err.message,
        className: "bg-red-600 text-white",
        duration: 1500
      })
    }
  }
  const selectMusic = () => {
    current(index)
  }

  return (
    <div ref={ref} id={`music-card-${music.id}`} className='w-full flex  gap-2 overflow-hidden text-white font-semibold text-xl px-2 py-2 border-2 hover:bg-blue-700 border-blue-500 cursor-pointer rounded-xl' style={{ backgroundColor: index === currentMusic ? "rgba(0, 122, 255, 1)" : "" }} key={music.id} onClick={selectMusic}>
      <div className='shrink-0 w-[100px] h-[100px] rounded-3xl overflow-hidden'>
        <img src={music.coverArt || `/music-player.png`} loading="lazy" alt="cover-art" className='w-full h-full object-cover' width={100} height={100} />
{/* <Image src={music.coverArt || `/music-player.png`} alt="cover-art" className='w-full h-full object-cover' width={100} height={100}/>  */}
      </div>
      <div className='flex flex-col gap-2'>
        <p>{music.title}</p>
        <p>{music.artist || "Unknown"}</p>
        <div className='flex gap-4'>
          <button className='bg-black hover:bg-green-600 border border-green-600 text-white p-2 rounded-full'
            onClick={
              (e) => {
                e.stopPropagation();
                const element = document.getElementById(`music-card-actions-popover-${music.id}`)
                if (element) element.style.display = "flex"
              }
            }
          >
            <MdMoreHoriz className='size-5' />
          </button>
          <button className='bg-black hover:bg-green-600  border border-green-600 text-white p-2 rounded-full' onClick={(e) => searchTermInput(e)}>
            <IoSearch className='size-5' />
          </button>
          <div id={`music-card-actions-popover-${music.id}`}
            className="fixed top-0 bg-gray-900/50 bottom-0 right-0 left-0 hidden  items-center justify-center"
            onClick={
              (e) => {
                e.stopPropagation();
                const element = document.getElementById(`music-card-actions-popover-${music.id}`)
                if (element) element.style.display = "none"
              }}
          >
            <div>
              <dialog>
                heelo
              </dialog>
            </div>
            <div className="flex gap-4  bg-black p-5 rounded-3xl">
              <button className="bg-gray-700 hover:bg-gray-800 p-3 rounded-xl">
                <IoEye className='size-6' />
              </button>
              <button className="bg-gray-700 hover:bg-gray-800 p-3 rounded-xl">
                <MdEdit className='size-6' />
              </button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
              <button className="bg-gray-700 hover:bg-gray-800 p-3 rounded-xl">
                <MdDelete className='size-6' />
              </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.This will permanently delete your music item.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={(e)=>deleteItem(e)}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>

      <div ref={metadataSearchContainerRef} className='hidden items-center justify-center bg-black/80 absolute top-0 bottom-0 right-0 left-0 cursor-not-allowed '>
        <div className="rounded-3xl px-4 py-4 space-y-4 w-[450px] bg-[#194566]">
          <input ref={metadataSearchInputRef} type="text" defaultValue={music.title} className='w-full text-black rounded-3xl px-4 py-2' />
          <div className='flex justify-center gap-4 '>
            <button className='rounded-3xl bg-black text-white px-4 py-2'
              onClick={
                (e) => {
                  e.stopPropagation();
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