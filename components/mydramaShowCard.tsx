"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { useToast } from "./ui/use-toast";
import { ShowMyDramalist } from "@/types";
import { addMyDramalistShow } from "@/actions/watchlistActions";
import { addItemToIgnoreList } from "@/actions/ignorelistActions";
import { MdClose, MdDescription, MdSave } from "react-icons/md";
import { TiCancel } from "react-icons/ti";

export default function MyDramaShowCard({ item }: { item: ShowMyDramalist }) {
  const [showDescription,setShowDescription] = useState(false);
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
  return (
    <div
      ref={cardRef}
      className="bg-teal-950 relative flex flex-col gap-1 items-center justify-between rounded-lg  px-2 py-3 text-center overflow-hidden transition-all duration-500"
      >
      <div className="relative overflow-hidden w-[90%]  mx-auto aspect-2/3">
        <Image src={item?.image || ""} alt="cover" fill quality={100} className="bg-cover" />
      </div>
      {
        item.ranking && <div className="absolute top-0 right-0  text-white bg-cyan-700 px-4 py-2 rounded-bl-3xl">{item.ranking}</div>
      }
      {
        item.rating && <div className="absolute top-0 left-0  text-white bg-cyan-700 px-4 py-2 rounded-br-3xl">{item.rating}</div>
      }
      <a
        href={`https://mydramalist.com${item.link}`}
        target="_blank"
        className="text-xl font-bold text-white "
      >
        {item.title}
      </a>
      {
        item?.info && <div className="text-neutral-300">{item?.info}</div>
      }
      {
        item?.description && showDescription &&
        <div 
        className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/90 ">
        <button onClick={() => setShowDescription(false)}>
          <MdClose className="bg-red-600 text-white rounded-full w-8 h-8 p-1 cursor-pointer absolute top-4 right-4"/>
        </button>
        <p className="text-white text-lg md:text-xl ">{item?.description}</p>
          </div>
      }
      
      <div className="flex items-center justify-between w-full gap-4 text-lg">
        <button className="bg-black px-4 py-2 text-white rounded-lg hover:bg-orange-600 cursor-pointer" onClick={() => setShowDescription(true)}>
          <MdDescription />
        </button>
        <button className="bg-black px-4 py-2 text-white rounded-lg hover:bg-orange-600 cursor-pointer" onClick={handleClick}>
          <TiCancel />
        </button>
        <button className="bg-black px-4 py-2 text-white rounded-lg hover:bg-orange-600 cursor-pointer" onClick={saveToDB}>
          <MdSave />
        </button>
      </div>

    </div>
  )
}