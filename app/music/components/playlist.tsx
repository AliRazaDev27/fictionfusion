import { BiSolidSelectMultiple } from "react-icons/bi"
import CreatePlaylist from "../create-playlist"
import { useMusicStore } from "../music-context"
import { MdDelete } from "react-icons/md"
import { FaSave } from "react-icons/fa"
import { use, useEffect } from "react"
import { List } from "@/lib/database/listSchema"
import { Music } from "@/lib/database/musicSchema"
import { addToPlaylist, removeFromPlaylist } from "@/actions/playlistActions"
import { useToast } from '@/components/ui/use-toast';

export function PlaylistView({ list,selected }) {
    const data: { success: boolean, lists: List[] } = use(list)
    const playlist = useMusicStore((state: any) => state.playlist)
    const addPlaylist = useMusicStore((state: any) => state.addPlaylist);
    const fullMusicList = useMusicStore((state: any) => state.fullMusicList)
    const addMusic = useMusicStore((state: any) => state.addMusic);
    const { toast } = useToast()

    function loadPlaylist(id: any) {
        const selected_playlist = playlist.find((list) => list.id === id)
        const filtered = fullMusicList.filter((music: Music) => selected_playlist?.items?.includes(music.id))
        addMusic(filtered)
    }

  async function saveToPlaylist(id: number) {
    // start with easist solution
    if (selected.current && selected.current.length > 0) {
      const result = await addToPlaylist(id, selected.current)
      if (result?.success && result.items) {
        toast({
          title: "Success",
          description: "Added to playlist",
          className: "bg-green-600 text-white",
          duration: 1500
        })
        const thisList = playlist.find((list) => list.id === id)
        if(!thisList) return
        thisList.items = result.items
        const updatedPlaylist = playlist.map((list) => list.id === id ? thisList : list)
        addPlaylist(updatedPlaylist)
      }
      else {
        toast({
          title: "Error",
          description: result?.message,
          className: "bg-red-600 text-white",
          duration: 1500
        })
      }
    }
  }
    async function deleteFromPlaylist(id: number) {
        if (selected.current && selected.current.length > 0) {
            const result = await removeFromPlaylist(id, selected.current)
            if (result?.success && result.items) {
                toast({
                    title: "Success",
                    description: "Removed from playlist",
                    className: "bg-green-600 text-white",
                    duration: 1500
                })
                const thisList = playlist.find((list) => list.id === id)
                if(!thisList) return
                thisList.items = result.items
                const updatedPlaylist = playlist.map((list) => list.id === id ? thisList : list)
                addPlaylist(updatedPlaylist)
            }
            else {
                toast({
                    title: "Error",
                    description: result?.message,
                    className: "bg-red-600 text-white",
                    duration: 1500
                })
            }
        }
    }


    useEffect(() => {
        addPlaylist(data.lists)
    }, [])

    return (
        <div id="playlists" className='flex flex-col gap-4 w-full px-2 sm:px-4 py-4'>
            <div className='flex justify-between items-center'>
                <p className='text-xl font-medium text-white'>Playlists</p>
                <div className='flex items-center gap-2'>
                    <CreatePlaylist />
                    <button className='bg-black hover:bg-green-700 border border-green-700 text-white px-2 py-2 rounded-full' onClick={() => {
                        selected.current = []
                        const selectionElement = document.querySelectorAll('.selection-box')
                        selectionElement.forEach((element: any) => {
                            element.classList.toggle('hidden')
                            element.checked = false
                        })
                    }}>
                        <BiSolidSelectMultiple className='size-6' />
                    </button>
                </div>
            </div>
            <div className='flex flex-col gap-2'>
                {
                    playlist && playlist.length > 0 && playlist.map((playlist: any, index: number) => (
                        <div key={index} className='w-full ps-4 flex items-center justify-between'>
                            <button
                                className='bg-black hover:scale-105 transition-transform duration-100 shadow-sm shadow-neutral-400 px-4 py-2 text-white rounded-xl'
                                onClick={(event) => {
                                    loadPlaylist(playlist.id)
                                    const playlistButtons = document.querySelectorAll('.playlist-toggle')
                                    playlistButtons.forEach((button: any) => button.classList.remove('playlist-toggle'));
                                    (event.target as HTMLElement).classList.toggle('playlist-toggle')
                                }}
                            >
                                {playlist.listName} - {playlist.items.length}
                            </button>
                            <div className='flex gap-2 items-center'>
                                <button className='bg-black hover:bg-green-700 border border-green-700 text-white px-2 py-2 rounded-full'
                                    onClick={() => deleteFromPlaylist(playlist.id)}>
                                    <MdDelete className='size-6' />
                                </button>

                                <button className='bg-black hover:bg-green-700 border border-green-700 text-white px-2 py-2 rounded-full'
                                    onClick={() => saveToPlaylist(playlist.id)}>
                                    <FaSave className='size-6' />
                                </button>

                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}