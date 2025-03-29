import { useMusicStore } from "../music-context"
import { use, useEffect } from "react"
import { List } from "@/lib/database/listSchema"
import { Music } from "@/lib/database/musicSchema"

export function PlaylistView({ list}) {
    const data: { success: boolean, lists: List[] } = use(list)
    const playlist = useMusicStore((state: any) => state.playlist)
    const addPlaylist = useMusicStore((state: any) => state.addPlaylist);
    const fullMusicList = useMusicStore((state: any) => state.fullMusicList)
    const addMusic = useMusicStore((state: any) => state.addMusic);

    function loadPlaylist(id: any) {
        const selected_playlist = playlist.find((list) => list.id === id)
        const filtered = fullMusicList.filter((music: Music) => selected_playlist?.items?.includes(music.id))
        addMusic(filtered)
    }



    useEffect(() => {
        addPlaylist(data.lists)
    }, [])

    return (
        <div id="playlists" className='flex flex-col gap-4 w-full px-2 sm:px-4 py-4'>
            <div className='flex justify-between items-center'>
                <p className='text-xl font-medium text-white'>Playlists</p>
            </div>
            <div className='flex flex-col gap-2'>
                {
                    playlist && playlist.length > 0 && playlist.map((playlist: any, index: number) => (
                        <div key={index} className='w-full ps-4 flex items-center justify-between'>
                            <button
                                className='bg-black hover:scale-105 transition-transform duration-100 shadow-xs shadow-neutral-400 px-4 py-2 text-white rounded-xl'
                                onClick={(event) => {
                                    loadPlaylist(playlist.id)
                                    const playlistButtons = document.querySelectorAll('.playlist-toggle')
                                    playlistButtons.forEach((button: any) => button.classList.remove('playlist-toggle'));
                                    (event.target as HTMLElement).classList.toggle('playlist-toggle')
                                }}
                            >
                                {playlist.listName} - {playlist.items.length}
                            </button>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}