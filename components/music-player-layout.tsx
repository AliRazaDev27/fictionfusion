'use client'
import { useState,useRef } from 'react'
import { Music } from "@/lib/database/musicSchema";
import { MusicPlayer } from './music-player';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

export function MusicPlayerLayoutComponent({musicList}) {
  const [currentMusic, setCurrentMusic] = useState<number>(0);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [searchResults, setSearchResults] = useState<any>([]);
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
  const handleSearch=async(index:number)=>{
    const result = await fetch(`https://itunes.apple.com/search?term=${musicList[index].title}`)
    const response = await result.json()
    if(response.resultCount === 0) return
    if(searchContainerRef.current){
      searchContainerRef.current.style.display = "block"
    }
    setSearchResults(response.results)
    console.log(response.results)
  }
  return (
    <div className="w-full " style={{ height: `calc(100vh - ${70}px)` }}>
      <div className="hidden md:grid grid-cols-12  h-[90%]">
        <div className="col-span-4" id="sidebar">sidebar</div>
        <div className="border-l px-4  col-span-8  overflow-y-auto" id="content">
          <div className='space-y-2'>
            {musicList && musicList.map((music: Music,index:number) => (
              <div className='text-white font-semibold text-xl px-2 py-3 cursor-pointer rounded-xl' style={{backgroundColor:index === currentMusic ? "rgba(0, 122, 255, 1)" : ""}} key={music.id} onClick={() => current(index)}>
                {music.title}
                <button className='ms-8 w-min border bg-green-600' onClick={()=>handleSearch(index)}>Search</button>                
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
      <div className='fixed bg-emerald-800 top-0 bottom-0 left-0 right-0 w-full md:w-[600px] mx-auto ' style={{display:"none"}} ref={searchContainerRef}>
                <div className='absolute text-xl font-extrabold top-3 right-8 cursor-pointer' onClick={(e)=>{if(searchContainerRef.current) searchContainerRef.current.style.display = "none"}}>X</div>
                <div className='w-full border text-white border-white h-screen overflow-y-auto flex flex-col'>
                {
                  searchResults && searchResults.map((music: any,index:number) => (
                    <div className='flex border gap-2 p-2'>
                      <div className='size-[110px]'>
                        <img src={music.artworkUrl100} alt="artwork" className='bg-cover' />
                      </div>
                      <div className='flex flex-col sm:flex-row gap-2'>
<div className='flex flex-col gap-2'>
                      <p className='text-xl'>{music.trackName}</p>
                      <p className='text-lg'>{music.artistName}</p>
                      <p className='text-lg'>{music.releaseDate}</p>
                      
</div>
<div className='flex flex-col gap-2'>
<button className='w-max px-4 py-3 bg-green-500 rounded-3xl'>Update Info</button>
<audio src={music.previewUrl || ""} controls preload='metadata'>Audio Player not supported</audio>
</div>
                      </div>

                    </div>
                  ))
                }
                </div>
      </div>
    </div>
  )
}
