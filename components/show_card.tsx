"use client";

import { Show } from "@/types";
import { Badge } from "./ui/badge";
import Image from "next/image";
import RatingStar from "./ratingStar";

interface ShowCardProps {
  show: Show;
  onClick?: () => void;
}

export function ShowCard({ show, onClick }: ShowCardProps) {
  let image = show.image as any;
  let coverSrc = image?.medium ? image?.medium : image?.original;
  if (!coverSrc) coverSrc = "/bookplaceholder.svg";

  let rating = show.rating as any;
  let averageRating = rating;

  if (typeof rating === "object") {
    averageRating = rating?.average ? rating?.average : 0;
  }

  return (
    <div
      onClick={onClick}
      className="flex flex-col gap-3 p-3 border border-border bg-card rounded-xl text-card-foreground shadow-sm hover:shadow-md transition-shadow h-full cursor-pointer hover:ring-2 hover:ring-primary/50"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg group">
        <Image
          src={coverSrc}
          alt={show.name}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="font-semibold shadow-sm backdrop-blur-md bg-black/40 text-white">
            {show.status}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col gap-1 flex-1">
        <h3 className="text-lg font-bold leading-tight line-clamp-1" title={show.name}>
          {show.name}
        </h3>

        <div className="flex items-center gap-2 text-sm justify-between">
          <div className="flex items-center gap-1">
            <RatingStar rating={averageRating} max={1} />
            <span className="font-medium">{averageRating}</span>
          </div>
          <span className="text-muted-foreground text-xs">{show.premiered?.split("-")[0] || "N/A"}</span>
        </div>

        <div className="flex flex-wrap gap-1 mt-auto pt-2">
          {show.genres && show.genres.slice(0, 2).map((genre, i) => (
            <Badge key={i} variant="outline" className="text-[10px] px-1 py-0 h-5">
              {genre}
            </Badge>
          ))}
          {show.genres && show.genres.length > 2 && (
            <span className="text-[10px] text-muted-foreground self-center">+{show.genres.length - 2}</span>
          )}
        </div>
      </div>
    </div>
  );
}
