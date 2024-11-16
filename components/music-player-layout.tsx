'use client'
import {useState,useEffect,useRef} from 'react'
import { getMusic } from "@/actions/musicActions";
import { Music } from "@/lib/database/musicSchema";
import { MusicPlayer } from './music-player';

export function MusicPlayerLayoutComponent() {
  const [musicList, setMusicList] = useState<Music[]>([]);
  const [currentMusic, setCurrentMusic] = useState<Music>();
  useEffect(() => {
      const fetchMusic = async () => {
          const data = await getMusic();
          if(data.success && data.music){
          setMusicList(data.music);
          }
      }
      fetchMusic();
  },[])
  return (
    <div className="border border-red-400 w-full " style={{height: `calc(100vh - ${70}px)`}}> 
    <div className="border border-green-500 grid grid-cols-12 h-[90%]">
    <div className="border border-blue-500 col-span-4">sidebar</div>
    <div className="border border-pink-500 col-span-8 overflow-y-auto">
      <div>
        {musicList && musicList.map((music:Music) => (
          <div className='text-white font-semibold text-xl px-2 py-3 cursor-pointer' key={music.id} onClick={()=>setCurrentMusic(music)}>
            {music.title}
            </div>
          ))}
      </div>
    </div>
    </div>
    <div className=" border border-yellow-600 h-[10%]">
<MusicPlayer musicSource={currentMusic?.fileUrlPublic || ""} />
    </div>
    </div>
  )
}
