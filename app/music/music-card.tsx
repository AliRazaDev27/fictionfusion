"use client"
import { forwardRef } from "react";
import { Music } from "@/lib/database/musicSchema";
import { useMusicStore } from "./music-context";


interface MusicCardProps {
  music: Music;
  index: number;
}
export const MusicCard = forwardRef<HTMLDivElement, MusicCardProps>(({ music, index }, ref) => {
  const currentMusic = useMusicStore((state: any) => state.current)
  const current = useMusicStore((state: any) => state.setCurrent)

  const selectMusic = () => {
    current(index)
  }

  return (
    <div ref={ref} id={`music-card-${index}`} className='w-full flex  gap-2 overflow-hidden text-white font-semibold text-xl px-2 py-2  hover:bg-teal-700  bg-slate-800 cursor-pointer rounded-xl' style={{ backgroundColor: index === currentMusic ? "rgba(0, 122, 255, 1)" : "" }} key={music.id} onClick={selectMusic}>
      <div className='shrink-0 w-[100px] h-[100px] rounded-3xl overflow-hidden'>
        <img src={music.coverArt || `/music-player.png`} loading="lazy" alt="cover-art" className='w-full h-full object-cover' width={100} height={100} />
      </div>
      <div className='flex pt-2 ps-2 flex-col gap-3'>
        <p className="text-xl">{music.title}</p>
        <p className="text-lg">{music.artist || "Unknown"}</p>
      </div>
    </div>
  )
})
MusicCard.displayName = "MusicCard";