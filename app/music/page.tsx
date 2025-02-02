import { MusicPlayerLayoutComponent } from "./music-player-layout";
import { getMusic } from "@/actions/musicActions";
import { getAllMusicPlaylists } from "@/actions/playlistActions";
import "./styles.css"

export const dynamic = "force-static";

export default function Page(){
    const data = getMusic();
    const playlist = getAllMusicPlaylists();
    return(
    <MusicPlayerLayoutComponent music={data} list={playlist}/>
    )
}
