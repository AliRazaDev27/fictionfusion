import { MusicPlayerLayoutComponent } from "./music-player-layout";
import { getMusic } from "@/actions/musicActions";
import { getAllMusicPlaylists } from "@/actions/playlistActions";
import "./styles.css"

export const dynamic = "force-dynamic";

export default async function Page(){
    // {
    // let a = performance.now();
    // const [data, playlist] = await Promise.all([getMusic(), getAllMusicPlaylists()]);
    // console.log("time taken", performance.now() - a);
    // }
    // console.log(`page: ${Date.now()}`);
    const data = getMusic();
    const playlist = getAllMusicPlaylists();
    return(
    <MusicPlayerLayoutComponent music={data} list={playlist}/>
    )
}
