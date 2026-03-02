"use server";

import { Music } from "./page";

export async function getArtist(artistName:string){
  const url = `https://itunes.apple.com/search?term=${artistName}&entity=song&attribute=artistTerm&limit=200`
  const map = new Map();
  const response = await fetch(url)
  const data = await response.json()
  for (let i = 0; i < data.results.length; i++) {
    const item: Music = data.results[i]
    if (item.artistName !== decodeURIComponent(artistName)) continue
    if (item.collectionArtistName === "Various Artists") continue
    if (map.has(item.trackName)) continue
    map.set(item.trackName, item)
  }
  const store = Array.from(map.values())
  return store;
}