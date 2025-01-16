import { Input } from "@/components/ui/input"
import { MusicCard } from "../music-card"
import { Suspense, use } from "react"
import { Music } from "@/lib/database/musicSchema"
import { useMusicStore } from "../music-context"

export function MusicList({musicPromise,handleSelection,handleSearch}){
    const result = use<any>(musicPromise)
    const musicList = result.music
    const setMusic = useMusicStore((state:any) => state.addMusic)
    setMusic(musicList)
    return(
        <Suspense fallback={<div>Loading...</div>}>
          <div id="content" className="w-full md:border-l px-4 flex-1 space-y-4 pt-4  overflow-y-auto overflow-x-clip">
            {musicList && musicList.length > 0 && musicList.map((music: Music, index: number) => (
              <div key={index} className='w-full  flex  items-center gap-4'>
                <Input type="checkbox" value={music.id} onChange={() => handleSelection(music.id)} className='size-5 shrink-0 selection-box hidden' />
                <MusicCard  music={music} index={index} handleSearch={handleSearch} />
              </div>
            ))}
          </div>
        </Suspense>
    )
}