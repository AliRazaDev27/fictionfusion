import { MdFavorite } from "react-icons/md";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useMusicStore }  from "./music-context";
import { List } from "@/lib/database/listSchema";

export function AddToPlaylist({index}: {index: number}) {
    const list = useMusicStore((state:any) => state.playlist)
    return (
        <Dialog>
            <DialogTrigger className="bg-gray-700 hover:bg-gray-800 p-3 rounded-xl">
                <MdFavorite className="size-6" />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add to a playlist</DialogTitle>
                    <DialogDescription>
                        Choose a playlist to add this song to.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    {list.map((item, index) => (
                        <div className="flex border border-black justify-start items-center gap-4" key={index}>
                            <Input type="checkbox" id="name" className="size-5" checked={item?.items?.includes(index) ? true : false } />
                            <Label htmlFor="name" className="font-semibold text-lg">
                                {item.listName}
                            </Label>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end">
                    <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">SAVE</button>
                </div>
            </DialogContent>
        </Dialog>
    );
}