import { MdAdd } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";
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
import { useRef,useState } from "react";
import { uploadToCloudinary } from "@/lib";
import { NewMusic } from "@/lib/database/musicSchema";
import { addMusic } from "@/actions/musicActions";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { IoArrowBack } from "react-icons/io5";
export function AddMusicFile() {
  const [stage, setStage] = useState(0);
  const fileMapRef = useRef(new Map());
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
  setSelectedFiles(e.target.files);
}
  const { toast } = useToast();
  async function doIt() {
    if (!!selectedFiles) {
      setStage(1);
      for (let file of selectedFiles) {
        // currently it does not support dot in filename
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
          fileMapRef.current.set(file.name, result.music);
        }
        else {
          // handle error, remove the file from cloudinary.
        }
      }
    }
  }
  return (
    <Dialog>
      <DialogTrigger className='bg-slate-700 hover:bg-green-700 text-white px-3 py-2 rounded-lg cursor-pointer'>
        <MdAdd />
      </DialogTrigger>
      {stage === 0 && (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Music Files</DialogTitle>
          <DialogDescription className="text-gray-900">
            Select the music files from your device, Use this format, <span className="font-bold text-nowrap">Title-Artist.ext</span>
          </DialogDescription>
        </DialogHeader>
        <div className='w-full flex flex-col gap-2  py-2'>
          <div className="flex items-center gap-4">
            <Input type="file" multiple onChange={handleFileChange} />
          </div>
          <div className="flex justify-end px-4">
            <Button onClick={doIt}
              className="w-fit bg-black hover:bg-green-700 text-white px-3 py-2 rounded-lg"
            >
              ADD
            </Button>
          </div>
        </div>
      </DialogContent>
      )}


      { stage === 1 && (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
          <p className="flex items-center gap-2">
            <IoArrowBack onClick={() => setStage(0)} className="cursor-pointer" />
            Status
          </p>
            </DialogTitle>
          <DialogDescription className="text-gray-900 sr-only">
            Uploading files to the cloudainary.
          </DialogDescription>
        </DialogHeader>
        <div className='w-full flex flex-col gap-2  py-2'>
          {
            !selectedFiles && <p>No files selected</p>
          }
          {
            !!selectedFiles && 
            Array.from(selectedFiles).map((file) => (
              <div key={file.name} className="flex items-center gap-4">
                {/*  */}
                <div className="">
              <FaSpinner className="animate-spin text-xl" />
                  {/* <img
                    src={`https://placehold.co/48x48`}
                    alt={"image cover"}
                    className="w-12 h-12"
                  /> */}
                </div>
                <div className="flex flex-col gap-1">
                <p className="text-gray-900">{file.name}</p>
                  <Button onClick={() => {
                    setStage(2);
                  }}
                   className="w-fit">Metadata
                  </Button>
                </div>
              </div>
            ))
          }
        </div>
      </DialogContent>
      )}


      { stage === 2 && (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
          <p className="flex items-center gap-2">
            <IoArrowBack onClick={() => setStage(1)} className="cursor-pointer" />
            Metadata
          </p>
            </DialogTitle>
          <DialogDescription className="text-gray-900 sr-only">
            Set metadata for the files.
          </DialogDescription>
        </DialogHeader>
        <div className='w-full flex flex-col gap-2  py-2'>
          {
            !selectedFiles && <p>No files selected</p>
          }
          {
            !!selectedFiles && (
              <div>
                <Input type="text" placeholder="Title" />
              </div>
            )
          }
        </div>
      </DialogContent>
      )}
    </Dialog>
  )
}