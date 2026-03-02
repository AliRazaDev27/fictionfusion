import { Suspense, use } from "react";
import ArtistRender from "./render";

export type Music = {
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
type Params = Promise<{ id: string }>
export default async function Page(props: PageProps<"/music/artists/[id]">) {
  const id = props.params.then((params) => params.id);
  return (
    <Suspense fallback={<p>Loading</p>}>
      <ArtistRender id={id} />
    </Suspense>
  )
}
