"use client";
import Image from "next/image";
import RatingStar from "./ratingStar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { addItemToIgnoreList } from "@/actions/ignorelistActions";
import { useToast } from "./ui/use-toast";
import {  useRef } from "react";

export default function MyDramaShowCard({item}:any) {
    const cardRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast()
    const handleClick = async () => {
        if (cardRef.current){
          cardRef.current.style.opacity = "0.5";
          cardRef.current.style.scale = "0.0";
          setTimeout(() => {
            if (cardRef.current) {
              cardRef.current.style.display = "none";
            }
          }, 500);
        }
        const result = await addItemToIgnoreList(item.title);
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
    return(
        <div ref={cardRef} className="bg-sky-950 relative flex flex-col gap-2 items-center justify-between rounded-lg  p-4 text-center transition-all duration-500">
      <div className="relative overflow-hidden w-[60%]  mx-auto aspect-[2/3]">
        <Image src={item.image} alt="cover" fill className="bg-cover" />
      </div>
      {
        item.ranking && <div className="absolute top-2 right-2 text-white bg-orange-500 px-2 py-1 rounded-xl">{item.ranking}</div>
      }
      <a
        href={`https://mydramalist.com${item.link}`}
        target="_blank"
        className="text-xl text-white"
      >
        {item.title}
      </a>
      {item.rating && (
        <div className="flex items-center gap-4">
          <RatingStar rating={item.rating} max={10} />
          <Badge className="bg-orange-500 text-white text-lg">
            {item.rating}
          </Badge>
        </div>
        
      )}
      {
        item?.info && <div className="text-neutral-300">{item?.info}</div>
      }
        {
          item?.description && <div className="text-white text-lg line-clamp-4">{item?.description}</div>
        }
      <Button className="hover:bg-orange-600" onClick={handleClick}>
        Ignore
      </Button>
    </div>
    )
}