import { MusicPlayerLayoutComponent } from "@/components/music-player-layout";
import "./styles.css"
import { getMusic } from "@/actions/musicActions";

export default async function Page(){
    const data = await getMusic()
    return(
        <div>
    <MusicPlayerLayoutComponent musicList={data.music}/>
        </div>
    )
}
