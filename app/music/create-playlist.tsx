import { MdPlaylistAdd } from "react-icons/md";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { createPlaylist, getAllMusicPlaylists } from "@/actions/playlistActions";
import { useToast } from "@/components/ui/use-toast";
import { useContext } from "react";
import PlaylistContext from "./music-context";
export default function Create({addPlaylist}) {
    const playlist = useContext(PlaylistContext)
    const [title, setTitle] = useState('');
    const { toast } = useToast();
    async function createMusicPlaylist() {
        const result = await createPlaylist(title);
        if(result.success){
            toast({
                title:"Playlist Created",
                duration:2000,
                className:"bg-green-600 text-white",
            })
            addPlaylist([...playlist, result.list]);

        }
        else{
            toast({
                title:"Error creating playlist",
                description:result?.message,
                duration:2500,
                className:"bg-red-600 text-white",
            })
        }
    }
    return(
        <Dialog>
  <DialogTrigger className="text-2xl text-white bg-black rounded-full px-2 py-2 border hover:bg-green-700 border-green-700">
            <MdPlaylistAdd />
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create a new playlist.</DialogTitle>
      <DialogDescription>
        Enter a new playlist name.
      </DialogDescription>
    </DialogHeader>
     <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-center font-semibold">
              Name
            </Label>
            <Input
              id="name"
              className="col-span-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <DialogClose asChild>
            <button onClick={createMusicPlaylist} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Create</button>
</DialogClose>
          </div>
  </DialogContent>
</Dialog>
    )
}