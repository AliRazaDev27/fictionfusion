import { MusicPlayerLayoutComponent } from "@/components/music-player-layout";
import "./styles.css"
import { getMusic } from "@/actions/musicActions";

export const dynamic = "force-static"
export default async function Page(){
    const data = await getMusic()
    return(
        <div>
    <MusicPlayerLayoutComponent music={data.music}/>
        </div>
    )
}
