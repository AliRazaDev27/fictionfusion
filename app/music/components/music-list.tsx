import { Input } from "@/components/ui/input"
import { MusicCard } from "../music-card"
import { Suspense, use, useEffect, useRef, useState } from "react"
import { Music } from "@/lib/database/musicSchema"
import { useMusicStore } from "../music-context"

export function MusicList({musicPromise,handleSelection,handleSearch}){
    const result = use<any>(musicPromise)
    // const musicList = result.music.slice(0,10);
    const musicList = useMusicStore((state:any) => state.music)
    const setMusic = useMusicStore((state:any) => state.addMusic)
    const setFullMusicList = useMusicStore((state:any) => state.setFullMusicList)
    const [visibleCount, setVisibleCount] = useState(5) // Start with 5 items
    const observerRef = useRef(null)

    useEffect(() => {
      setMusic(result.music)
      setFullMusicList(result.music)
    }, [result.music])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const lastItem = entries[0]
                if (lastItem.isIntersecting) {
                    setVisibleCount((prev) => Math.min(prev + 5, musicList.length)) // Load 5 more at a time
                }
            },
            { root: null, rootMargin: "100px", threshold: 0.1 }
        )

        if (observerRef.current) {
            observer.observe(observerRef.current)
        }

        return () => {
            if (observerRef.current) observer.unobserve(observerRef.current)
        }
    }, [musicList])

    return(
        <Suspense fallback={<div>Loading...</div>}>
          <div id="content" className="w-full md:border-l px-4 flex-1 space-y-4 pt-4  overflow-y-auto overflow-x-clip">
            {musicList && musicList.length > 0 && musicList.slice(0, visibleCount).map((music: Music, index: number) => (
              <div key={index} className='w-full  flex  items-center gap-4'>
                <Input type="checkbox" value={music.id} onChange={() => handleSelection(music.id)} className='size-5 shrink-0 selection-box hidden' />
                <MusicCard  music={music} index={index} handleSearch={handleSearch} />
              </div>
            ))}
            <div ref={observerRef} className="h-10" />
          </div>
        </Suspense>
    )
}