import { MdPlayCircle } from "react-icons/md";
import { PlayButton } from "./play-button";

type Music = {
  artistName: string,
  artistId: number,
  trackId: number,
  trackName: string,
  collectionArtistName?: string,
  collectionName?: string,
  artistViewUrl: string,
  previewUrl: string,
  artworkUrl100: string,
  releaseDate: string,
  trackTimeMillis: number,
  discCount: number,
  discNumber: number,
  trackCount: number,
  trackNumber: number,
}


export default async function Page({ params }) {
  const { id: artistName } = await params
  const url = `https://itunes.apple.com/search?term=${artistName}&entity=song&attribute=artistTerm&limit=200`
  const map = new Map();
  const response = await fetch(url)
  const data = await response.json()
  console.log(data)
  for (let i = 0; i < data.results.length; i++) {
    const item: Music  = data.results[i]
    if (item.artistName !== decodeURIComponent(artistName)) continue
    if (item.collectionArtistName === "Various Artists") continue
    if (map.has(item.trackName)) continue
    map.set(item.trackName, item)
  }
  const store = Array.from(map.values())

  return (
    <div className="container max-w-3xl mx-auto p-4 flex flex-col gap-4">
    <div className="text-neutral-300">
      <h1 className="text-3xl font-bold text-white">{decodeURIComponent(artistName)}</h1>
      <p>Total: {data.resultCount}</p>
      <p>Filtered: {store.length}</p>
    </div>
      {
        store.map((music: Music, index: number) => (
          <div key={index} className="w-full flex items-center gap-2 overflow-hidden text-white font-semibold text-xl px-2 py-2 bg-slate-800 rounded-xl">
            <div className="relative z-0 shrink-0 w-[100px] h-[100px] rounded-lg overflow-hidden">
              <img src={music.artworkUrl100} alt="cover-art" loading="lazy" className="w-full h-full object-cover" width={100} height={100} />
            </div>
            <div className="flex flex-col">
              <p className="text-lg md:text-xl">{music.trackName}</p>
              <p className="text-sm md:text-base text-gray-300">{music.artistName}</p>
              {music.collectionName && <p className="text-xs md:text-sm text-gray-400">Album: {music.collectionName}</p>}
              <div className="flex gap-4 text-xs md:text-sm text-gray-400">
                <div>
              {music.releaseDate && <p className="text-xs md:text-sm text-gray-400">Released: {new Date(music.releaseDate).toLocaleDateString()}</p>}
              {music.trackTimeMillis && <p className="text-xs md:text-sm text-gray-400">Duration: {Math.floor(music.trackTimeMillis / 60000)}m {Math.floor((music.trackTimeMillis % 60000) / 1000)}s</p>}
                </div>

                <div>
                {music.discCount > 1 &&
                  <p>Disc {music.discNumber} of {music.discCount}</p>
                }
                { music.trackCount > 1 &&
                  <p>Track {music.trackNumber} of {music.trackCount}</p>
                }
                </div>
              </div>
            </div>
            <div className="ms-auto">
              <PlayButton src={music.previewUrl} />
            </div>
          </div>
        ))
      }
    </div>
  )
}
