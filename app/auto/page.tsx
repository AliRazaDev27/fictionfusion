"use client";

import { getMusic, updateMusicCoverArt } from "@/actions/musicActions";

export default  function Page() {
  const updateCovers = async() => {
    const result = await getMusic();
    console.log(result.music)
    return;
    if(result.success && result.music){
      for(let item of result.music){
        const _id = item.id;
        const _title = item.title;
        const _artist = item.artist;
        await getCover(_id,_title,_artist)
      }

    }
  }

  const getCover = async(id: number,title: string,artist: string) => {
    const songName = title.replace(" ","+");
    const result = await fetch(`https://itunes.apple.com/search?term=${songName}&entity=song&format=json`);
    const data = await result.json();
    for(let item of data.results) {
      const _title = item.trackName;
      if(_title.toLowerCase().includes(artist.toLowerCase())){
      if(artist === ""){
        const _cover = item.artworkUrl100;
        const result = await updateMusicCoverArt(id,_cover)
        console.log(title,result);
        break;
      }  
      const _artist = item.artistName;
      if(_title.toLowerCase().includes(artist.toLowerCase())){
        const _cover = item.artworkUrl100;
        const result = await updateMusicCoverArt(id,_cover)
        console.log(title,result);
        break;
      }
      }
    }
  }
  return (
    <div className="container h-[80vh] mx-auto border border-black my-8 flex justify-center items-center ">
      <button className="bg-green-500 text-white px-4 py-2" onClick={updateCovers}>GET COVER</button>
    </div>
  );
}
