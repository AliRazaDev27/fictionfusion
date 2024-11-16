import { getMusic } from "@/actions/musicActions";
import { MusicPlayerLayoutComponent } from "@/components/music-player-layout";
import { Music } from "@/lib/database/musicSchema";
import "./styles.css"

export default async function Page(){
    // const data = await getMusic();
    // console.log(data)
    return(
        <div>
    <MusicPlayerLayoutComponent/>
        </div>
    )
}
