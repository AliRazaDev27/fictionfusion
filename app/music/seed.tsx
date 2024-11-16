"use client";
import { NewMusic } from "@/lib/database/musicSchema";
import { addMusic } from "@/actions/musicActions";
import {useRef} from "react"

async function getSignedUrl() {
  const response = await fetch('/api/getSignedUrl', {
    method: 'POST',
  });
  return response.json();
}
async function uploadToCloudinary(file) {
  const { signature, timestamp, cloud_name, api_key } = await getSignedUrl();

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', api_key);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);

  const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`;

  const response = await fetch(cloudinaryUploadUrl, {
    method: 'POST',
    body: formData,
  });

  return response.json();
}
export  function Seed() {
    const fileRef = useRef<HTMLInputElement>(null);
    const handleSave = async () => {
        const files = fileRef.current?.files;
        if(!!files){
        for(const file of files){
        const name = file.name;
        const nameWithoutExtension = name.split(".")[0];
        const parts = nameWithoutExtension.split("-");
        let title = "";
        let artist = "";
        if(parts.length === 2){
          artist = parts[0];
          title = parts[1];
        }
        else{
          title = nameWithoutExtension;
        }
        const response = await uploadToCloudinary(file);
        const {secure_url, public_id} = response;
        const music: NewMusic = {
            title: title,
            artist: artist,
            fileUrlPublic: secure_url,
            fileUrlPrivate: public_id,
            uploadedBy:"ADMIN"
        }
        const result = await addMusic(music);
        console.log(result)
        }
      }
        return true;
        
    }
    return (
        <main className="flex min-h-[90vh] flex-col items-center justify-center">
        <div className="flex flex-col gap-8">
            <input type="file" multiple ref={fileRef}/>
            <button onClick={() => handleSave()}>Save</button>
        </div>
        </main>
    );
}