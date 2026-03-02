import AudioLayout from "./AudioLayout";
import { getMusic } from "@/actions/musicActions";
import { getAllMusicPlaylists } from "@/actions/playlistActions";

export default async function Page() {
  const musicData = await getMusic();
  const playlistData = await getAllMusicPlaylists();

  return (
    <AudioLayout
      initialMusic={musicData.success ? musicData.music : []}
      initialPlaylists={playlistData.success ? playlistData.lists : []}
    >
      {/* Children are now rendered dynamically inside AudioLayout based on store state */}
    </AudioLayout>
  )
}