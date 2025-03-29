"use client";
import RatingStar from "@/components/ratingStar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { updateShowRating } from "@/actions/showActions";
import {useToast} from "./ui/use-toast"
export function ShowRatingUpdateCard({ item, id }: { item: any; id: any }) {
    const { toast } = useToast()
  const handleRatingUpdate = async () => {
    const result = await updateShowRating(id, item.rating);
    if (result.success) {
      toast({
        description: "Show Rating updated",
        duration: 1500,
        className: "bg-green-600 text-white"
      })
    }
    else {
      toast({
        description: result?.message || "Failed to update show rating",
        duration: 1500,
        className: "bg-red-600 text-white"
      })
    }
  };
  return (
    <div className="bg-sky-950 relative flex flex-col gap-2 items-center justify-between rounded-lg  p-4 text-center">
      <div className="relative overflow-hidden w-[60%]  mx-auto aspect-2/3">
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
          item?.description && <div className="text-white text-lg">{item?.description}</div>
        }
      <Button className="hover:bg-orange-600" onClick={handleRatingUpdate}>
        Update
      </Button>
    </div>
  );
}
