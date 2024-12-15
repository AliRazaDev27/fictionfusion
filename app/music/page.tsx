import { MusicPlayerLayoutComponent } from "./music-player-layout";
import { getMusic } from "@/actions/musicActions";
import { getAllMusicPlaylists } from "@/actions/playlistActions";
import "./styles.css"

export const dynamic = "force-dynamic";

export default async function Page(){
    const [data, playlist] = await Promise.all([getMusic(), getAllMusicPlaylists()]);
    return(
    <MusicPlayerLayoutComponent music={data.music} list={playlist.lists}/>
    )
}
