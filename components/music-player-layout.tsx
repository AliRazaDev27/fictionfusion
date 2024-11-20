'use client'
import { useState } from 'react'
import { Music } from "@/lib/database/musicSchema";
import { MusicPlayer } from './music-player';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function MusicPlayerLayoutComponent({musicList}) {
  const [currentMusic, setCurrentMusic] = useState<number>(0);
  const current = (id:number)=>{
    setCurrentMusic(id)
  }
  const next = () => {
    console.log((currentMusic + 1) % musicList.length)
    setCurrentMusic((currentMusic + 1) % musicList.length);
  }
  const prev = () => {
    setCurrentMusic((currentMusic - 1 + musicList.length) % musicList.length);
  }
  return (
    <div className="w-full " style={{ height: `calc(100vh - ${70}px)` }}>
      <div className="hidden md:grid grid-cols-12  h-[90%]">
        <div className="col-span-4" id="sidebar">sidebar</div>
        <div className="border-l px-4  col-span-8  overflow-y-auto" id="content">
          <div>
            {musicList && musicList.map((music: Music,index:number) => (
              <div className='text-white font-semibold text-xl px-2 py-3 cursor-pointer rounded-xl' style={{backgroundColor:index === currentMusic ? "rgba(0, 122, 255, 1)" : ""}} key={music.id} onClick={() => current(index)}>
                {music.title}
              </div>
            ))}
          </div>
        </div>
      </div>
       <div className="col-span-12  md:hidden h-[90%]">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="w-full grid grid-cols-2 h-[40px]">
              <TabsTrigger value="list" className='font-semibold text-lg'>List</TabsTrigger>
              <TabsTrigger value="find" className='font-semibold text-lg'>Find</TabsTrigger>
            </TabsList>
            <TabsContent value="list" className="h-[calc(90vh-110px)] overflow-y-auto overflow-x-clip ">
              <div className='px-2'>
                {musicList && musicList.map((music: Music,index:number) => (
                  <div 
                    className='text-white font-medium text-lg px-2 py-3 cursor-pointer hover:bg-gray-800 rounded-xl' 
                    style={{backgroundColor:index === currentMusic ? "rgba(0, 122, 255, 1)" : ""}}
                    key={music.id}
                    onClick={() => current(index)}
                  >
                    {music.title}
                  </div>
                ))}
              </div>
            </TabsContent>
             <TabsContent value="find" className="h-[calc(90vh-110px)] overflow-y-auto">
              <div className="p-4">
                {/* Add your search/find functionality here */}
                <div className="text-white">Search/Find content goes here</div>
              </div>
            </TabsContent>
        </Tabs>

      </div>
      <div className=" border h-[10%]">
        <MusicPlayer musicSource={musicList[currentMusic].fileUrlPublic || ""} next={next} prev={prev} />
      </div>
    </div>
  )
}
