"use client"
import { addMusic, revalidateMusic } from "@/actions/musicActions";
import { uploadToCloudinary } from "@/lib";
import { deleteMusicFileOnCloudinary } from "@/lib/cloudinaryHelper";
import { NewMusic } from "@/lib/database/musicSchema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useState, useRef } from "react"
import { ImSpinner2 } from "react-icons/im";
import { MdCheckCircle, MdDone, MdError } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

export default function Page() {
    const [stage, setStage] = useState(0);
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [searchResults, setSearchResults] = useState<any>([]);
    const [uploadStatus, setUploadStatus] = useState<any>({});
    const [metadataApplied, setMetadataApplied] = useState(false);
    const metadataSearchInputRef = useRef<HTMLInputElement>(null);
    const storeRef = useRef(new Map());
    const { toast } = useToast();
    async function autoApplyMetadata(files: FileList) {
        for (let file of files) {
            const searchTerm = file.name.split(".")[0];
            if (!searchTerm) continue;
            const title = encodeURIComponent(searchTerm);
            const result = await fetch(`https://itunes.apple.com/search?term=${title}`);
            const response = await result.json();
            if (response.resultCount > 0) {
                storeRef.current.set(file.name, response.results[0]);
            }
        }
        setMetadataApplied(true);
    }
    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return;
        setSelectedFiles(e.target.files);
        autoApplyMetadata(e.target.files);
        setStage(1);
    }
    async function handleSearch() {
        const searchTerm = metadataSearchInputRef.current?.value;
        if (!searchTerm) return
        const title = encodeURIComponent(searchTerm)
        const result = await fetch(`https://itunes.apple.com/search?term=${title}`)
        const response = await result.json()
        if (response.resultCount === 0) {
            console.log("no results");
            return;
        }
        setSearchResults(response.results)
    }
    function handleUpdate(music: any, fileName: string) {
        return () => {
            storeRef.current.set(fileName, music);
            toast({
                title: "Metadata updated",
                description: `Metadata for ${fileName} has been updated.`,
            })
        }
    }
    async function handleUpload() {
        if (!selectedFiles) return;
        let successCount = 0;
        let errorCount = 0;

        for (let file of selectedFiles) {
            setUploadStatus((prev: any) => ({ ...prev, [file.name]: "uploading" }));
            const metadata = storeRef.current.get(file.name);
            if (!metadata) {
                setUploadStatus((prev: any) => ({ ...prev, [file.name]: "error" }));
                errorCount++;
                continue;
            }
            const response = await uploadToCloudinary(file);
            if (!response.secure_url) {
                setUploadStatus((prev: any) => ({ ...prev, [file.name]: "error" }));
                errorCount++;
                continue;
            }
            const { secure_url, public_id } = response;
            const music: NewMusic = {
                title: metadata.trackName || "null",
                artist: metadata.artistName || "null",
                album: metadata.collectionName || "null",
                releaseDate: metadata.releaseDate || "null",
                duration: (Math.round(metadata.trackTimeMillis / 1000)).toString() || '0',
                coverArt: metadata.artworkUrl100 || "null",
                fileUrlPublic: secure_url,
                fileUrlPrivate: public_id,
                uploadedBy: "ADMIN"
            }
            const result = await addMusic(music);
            if (result.success) {
                setUploadStatus((prev: any) => ({ ...prev, [file.name]: "success" }));
                successCount++;
            } else {
                setUploadStatus((prev: any) => ({ ...prev, [file.name]: "error" }));
                errorCount++;
                await deleteMusicFileOnCloudinary(public_id);
            }
        }
        toast({
            title: "Upload Complete",
            description: `${successCount} files uploaded successfully, ${errorCount} files failed.`,
        });
        if (successCount > 0) {
            revalidateMusic();
        }
    }
    return (
        <div className="bg-slate-900 text-white w-full">
            {stage === 0 && (
                <div className="flex items-center justify-center min-h-[89svh]">
                    <Input type="file" accept="audio/*" className="text-black w-fit cursor-pointer" multiple onChange={handleFileChange} />
                </div>
            )}
            {stage === 1 && (
                <div className='w-full min-h-[89svh] flex flex-col items-center gap-2 p-2'>
                    <div className="flex items-center justify-between md:px-8 md:py-2 w-full">
                        <Button className="cursor-pointer bg-red-500" onClick={() => setStage(0)}>Back</Button>
                        <Button className="cursor-pointer bg-green-600" onClick={handleUpload}>Upload</Button>
                    </div>
                    {
                        !selectedFiles && <p>No files selected</p>
                    }
                    <div className="flex flex-col gap-1 p-1 bg-slate-600">
                        {
                            !!selectedFiles &&
                            Array.from(selectedFiles).map((file) => (
                                <div key={file.name} className="flex items-center w-full justify-between gap-2 bg-sky-950">
                                    <div className="flex items-center gap-1">
                                        <div className="rounded-md overflow-clip">
                                            <img className="w-[100px] h-[100px]" src={storeRef.current.get(file.name)?.artworkUrl100 || "https://placehold.co/100"} alt={file.name} />
                                        </div>
                                        <div className="">
                                            <p className=""><span className="font-semibold text-green-500">Filename</span>: {file.name}</p>
                                            <p><span className="font-semibold text-green-500">Title</span>: {storeRef.current.get(file.name)?.trackName || "Unknown"}</p>
                                            <p><span className="font-semibold text-green-500">Artist</span>: {storeRef.current.get(file.name)?.artistName || "Unknown"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <div>
                                            <Dialog onOpenChange={(isOpen) => { if (!isOpen) { setSearchResults([]) } }}>
                                                <DialogTrigger className="text-sm font-semibold cursor-pointer bg-slate-300 text-gray-800 w-fit p-2 rounded-lg"><span className="flex items-center">
                                                    {storeRef.current.get(file.name) ? <MdDone className="mr-2 text-green-700 scale-150" /> : <RxCross2 className="mr-2 text-red-600 scale-150" />}
                                                    <span>Metadata</span></span> </DialogTrigger>
                                                <DialogContent className="overflow-y-auto">
                                                    <DialogHeader>
                                                        <DialogTitle>Set Cover Metadata</DialogTitle>
                                                        <DialogDescription className="sr-only">
                                                            Search with Itunes Search API for cover metadata.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div>
                                                        <Input type="text" defaultValue={file.name.split(".")[0]} ref={metadataSearchInputRef} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSearch(); } }} className="text-black outline" />
                                                        <div className="flex flex-col p-2 gap-2 h-[70svh]">
                                                            {
                                                                searchResults && searchResults.map((music: any, index: number) => (
                                                                    <div className="flex flex-col border rounded-xl gap-2 p-2 bg-slate-400" key={music.trackId}>
                                                                        <div className='flex items-center gap-2' key={index}>
                                                                            <div className='min-w-[100px] aspect-square'>
                                                                                <img src={music.artworkUrl100} alt="artwork" style={{ objectFit: "cover" }} loading='lazy' width={100} height={100} />
                                                                            </div>
                                                                            <div className='flex flex-col gap-1'>
                                                                                <p className='text-xl'>{music.trackName}</p>
                                                                                <p className='text-lg'>{music.artistName}</p>
                                                                                <p className='text-lg'>{music.releaseDate && music.releaseDate.split("T")[0]}</p>
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex items-center justify-between gap-2">
                                                                            <audio src={music.previewUrl || null} preload='none' controls controlsList="nodownload noplaybackrate noremote">Audio Player not supported</audio>
                                                                            <Button className="cursor-pointer" onClick={handleUpdate(music, file.name)}>Update</Button>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                        <div className="p-3">
                                            {uploadStatus[file.name] === "uploading" && <ImSpinner2 className="animate-spin h-7 w-7" />}
                                            {uploadStatus[file.name] === "success" && <MdCheckCircle className="h-7 w-7 text-green-500" />}
                                            {uploadStatus[file.name] === "error" && <MdError className="h-7 w-7 text-red-500" />}
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            )}
        </div>
    )
}
