"use client";
import Image from "next/image";
import { addItemToIgnoreList } from "@/actions/ignorelistActions";
import { useToast } from "./ui/use-toast";
import { useRef } from "react";
import {  ShowMyDramalist } from "@/types";
import { addMyDramalistShow } from "@/actions/watchlistActions";


export default function MyDramaShowCard({ item }: { item: ShowMyDramalist }) {
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
    <div ref={cardRef} className="bg-sky-950 relative flex flex-col gap-3 items-center justify-between rounded-lg  px-2 py-3 text-center overflow-hidden transition-all duration-500"
      style={{ background: 'linear-gradient(220.55deg, #B9A14C 0%, #000000 100%)' }}>
      <div className="relative overflow-hidden w-[90%]  mx-auto aspect-2/3">
        <Image src={item?.image || ""} alt="cover" fill quality={100} className="bg-cover" />
      </div>
      {
        item.ranking && <div className="absolute top-0 right-0 text-lg text-white bg-orange-500 px-4 py-2 rounded-bl-3xl">{item.ranking}</div>
      }
      {
        item.rating && <div className="absolute top-0 left-0 text-lg text-white bg-orange-500 px-4 py-2 rounded-br-3xl">{item.rating}</div>
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
        item?.description && <div className="text-white text-lg line-clamp-4">{item?.description}</div>
      }
      <div className="flex gap-4">
        <button className="bg-black px-4 py-2 text-white rounded-xl hover:bg-orange-600 cursor-pointer" onClick={handleClick}>
          Ignore
        </button>
        {/* <AddShowToDB show={showObject}/> */}
        <button className="bg-black px-4 py-2 text-white rounded-xl hover:bg-orange-600 cursor-pointer" onClick={saveToDB}>
          Add to DB
        </button>
      </div>
    </div>
  )
}