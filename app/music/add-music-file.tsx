import { MdAdd } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { useRef } from "react";
import { uploadToCloudinary } from "@/lib";
import { NewMusic } from "@/lib/database/musicSchema";
import { addMusic } from "@/actions/musicActions";
import { useToast } from "@/components/ui/use-toast";
export function AddMusicFile() {
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  async function doIt() {
    const files = fileRef.current?.files;
    if (!!files) {
      for (let file of files) {
        const fileName = (file.name.split(".")[0]).split("-");
        const title = fileName[0];
        const artist = fileName[1];
        const response = await uploadToCloudinary(file);
        const { secure_url, public_id } = response;
        const music: NewMusic = {
          title: title,
          artist: artist,
          fileUrlPublic: secure_url,
          fileUrlPrivate: public_id,
          uploadedBy: "ADMIN"
        }
        const result = await addMusic(music);
        if (result.success) {
          toast({
            title: "Success",
            description: `${title} added successfully`,
            className: "bg-green-600 text-white",
            duration: 1000
          })
        }
        else {
          toast({
            title: `${title} could not be added`,
            description: result.message,
            className: "bg-red-600 text-white",
            duration: 1000
          })
        }
      }
    }
  }
  return (
    <Dialog>
      <DialogTrigger className='bg-black hover:bg-green-700 text-white px-3 py-2 rounded-lg'>
        <MdAdd />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Music Files</DialogTitle>
          <DialogDescription>
            Select the music files from your device to start uploading, Use a special naming convention for the file, like <span className="font-bold text-nowrap">Title-Artist.mp3</span> etc.
          </DialogDescription>
        </DialogHeader>
        <div className='w-full flex flex-col gap-2  py-2'>
          <div className="flex items-center gap-4">
            <Input ref={fileRef} type="file" multiple />
          </div>
          <div className="flex justify-end px-4">
            <DialogClose onClick={doIt}
              className="w-fit bg-black hover:bg-green-700 text-white px-3 py-2 rounded-lg"
            >
              ADD
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}