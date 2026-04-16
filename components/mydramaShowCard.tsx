"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { useToast } from "./ui/use-toast";
import { ShowMyDramalist } from "@/types";
import { addMyDramalistShow } from "@/actions/watchlistActions";
import { addItemToIgnoreList } from "@/actions/ignorelistActions";
import { MdClose } from "react-icons/md";
import { Download, Info, Search, Trash } from "lucide-react";

export default function MyDramaShowCard({ item }: { item: ShowMyDramalist }) {
  const [showDescription, setShowDescription] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast()
  const handleClick = async () => {
    if (cardRef.current) {
      cardRef.current.style.opacity = "0.5";
      cardRef.current.style.scale = "0.0";
      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.style.display = "none";
        }
      }, 500);
    }
    if (item?.title) {
      const result = await addItemToIgnoreList(item?.title);
      if (result.success) {
        toast({
          description: "Item added to ignore list",
          duration: 1500,
          className: "bg-green-600 text-white"
        })
        if (cardRef.current && cardRef.current.parentNode) {
          cardRef.current.parentNode.removeChild(cardRef.current); // Safely remove the div from the DOM
        }
      }
      else {
        if (cardRef.current) cardRef.current.style.display = "flex";
        toast({
          description: result?.message || "Failed to add item to ignore list",
          duration: 1500,
          className: "bg-red-600 text-white"
        })
      }
    }
  }
  const saveToDB = async () => {
    const result = await addMyDramalistShow(`https://mydramalist.com${item.link}` || "");
    // const result = {success:true, message:"Item added to DB"}; // Mock result for testing
    if (result.success) {
      toast({
        description: "Item added to DB",
        duration: 1500,
        className: "bg-green-600 text-white"
      })
    }
    else {
      toast({
        description: result?.message || "Failed to add item to DB",
        duration: 1500,
        className: "bg-red-600 text-white"
      })
    }
  }
  const enhanceImage = (image: string) => {
    if(image === '') return "";
    else{
      let dotIndex = image.lastIndexOf('.');
      let imageFirstPart = image.slice(0, dotIndex);
      return imageFirstPart + "m" + ".jpg";
    }
  }
  return (
    <div
      ref={cardRef}
      className="hover:scale-105 hover:shadow-2xl transition-transform duration-300 bg-black/30 backdrop-blur-xl border border-white/20 shadow-white/10 shadow-lg rounded-2xl relative flex flex-col gap-1 items-center justify-between text-center overflow-hidden group"
    >
      <div className="relative overflow-hidden w-full  mx-auto aspect-2/3">
        <Image src={enhanceImage(item?.image || "")} alt={item?.title || "cover"} fill quality={100} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="bg-cover" />
      </div>
      {
        item.rating && <div className="absolute top-0 left-0  text-white font-semibold bg-white/15 backdrop-blur-xs px-4 py-2 rounded-br-3xl">{item.rating}</div>
      }
      <a
        href={`https://mydramalist.com${item.link}`}
        target="_blank"
        className="text-xl font-bold text-white "
      >
        {item.title}
      </a>
      {
        item?.description && showDescription &&
        <div
          className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/80 backdrop-blur-xs">
          <button onClick={() => setShowDescription(false)}>
            <MdClose className="bg-red-600 text-white rounded-full w-8 h-8 p-1 cursor-pointer absolute top-4 right-4" />
          </button>
          <div>

          <p className="text-white text-lg md:text-xl ">{item?.description}</p>
      {
        item?.info && <p className="text-gray-300 mt-4">{item?.info}</p>
      }
          </div>
        </div>
      }

      <div className="flex items-center justify-between w-full gap-4 text-lg py-2 px-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <button className="bg-cyan-700 px-1.5 py-1.5 text-white rounded-md hover:bg-emerald-700 cursor-pointer" onClick={() => setShowDescription(true)}>
          <Info />
        </button>
        <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(item?.title || "")}+trailer`} target="_blank" className="bg-cyan-700 px-1.5 py-1.5 text-white rounded-md hover:bg-emerald-700 cursor-pointer" onClick={() => setShowDescription(true)}>
          <Search/>
        </a>
        <button className="bg-cyan-700 px-1.5 py-1.5 text-white rounded-md hover:bg-emerald-700 cursor-pointer" onClick={handleClick}>
          <Trash />
        </button>
        <button className="bg-cyan-700 px-1.5 py-1.5 text-white rounded-md hover:bg-emerald-700 cursor-pointer" onClick={saveToDB}>
          <Download />
        </button>
      </div>

    </div>
  )
}