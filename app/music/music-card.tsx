"use client"
import { useEffect, forwardRef, useState } from "react";
import { Music } from "@/lib/database/musicSchema";
import { useMusicStore } from "./music-context";


interface MusicCardProps {
  music: Music;
  index: number;
}
export const MusicCard = forwardRef<HTMLDivElement, MusicCardProps>(({ music, index }, ref) => {
  const currentMusic = useMusicStore((state: any) => state.current)
  const current = useMusicStore((state: any) => state.setCurrent)
  const [cached, setCached] = useState(false)

  const selectMusic = () => {
    current(index)
  }

   const isCached = async(url: string)=>{
    const cache = await caches.open("cloudinary-media"); // or "workbox-precache-v2" depending on next-pwa config
    const match = await cache.match(url);
    return !!match;
  }

  useEffect(() => {
    async function checkCache() {
      if ("caches" in window) {
        if(!!music.fileUrlPublic){
        const result = await isCached(music.fileUrlPublic);
        setCached(result);
        }
      }
    }
    checkCache();
  }, [music]);

  return (
    <div ref={ref} id={`music-card-${index}`} className='w-full flex  gap-2 overflow-hidden text-white font-semibold text-xl px-2 py-2  hover:bg-teal-700  bg-slate-800 cursor-pointer rounded-xl' style={{ backgroundColor: index === currentMusic ? "rgba(0, 122, 255, 1)" : "" }} key={music.id} onClick={selectMusic}>
      <div className='relative z-0 shrink-0 w-[100px] h-[100px] rounded-lg overflow-hidden'>
        <img src={music.coverArt || `/music-player.png`} loading="lazy" alt="cover-art" className='w-full h-full object-cover' width={100} height={100} />
        {cached && <span className="absolute bottom-1 right-1 rounded-full w-3 h-3 border bg-lime-400"/>}
      </div>
      <div className='flex pt-1 ps-1 flex-col gap-1'>
        <p className="text-lg md:text-xl">{music.title}</p>
        <p className="text-sm md:text-base text-gray-300">{music.artist || "Unknown"}</p>
      </div>
    </div>
  )
})
MusicCard.displayName = "MusicCard";