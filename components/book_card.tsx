"use client";
import Image from "next/image";
import placeholder from "@/public/bookplaceholder.svg";
import { getOpenLibraryCoverLink } from "@/lib";
import { Book } from "@/types";
import React from "react";

export default function BookCard({ book }: { book: Book }) {
  const rating = book?.rating ?? (book as any)?.ratings_average ?? "0";

  return (
    <div className="w-full h-full overflow-hidden rounded-2xl">
      <div className="w-full">
        <div className="relative aspect-[2/3]">
          <Image
            src={getOpenLibraryCoverLink(book.cover_edition_key)}
            alt={book.title}
            fill
            quality={90}
            className="object-cover"
            placeholder="blur"
            blurDataURL={placeholder.src}
            onError={(e) => {
              e.currentTarget.src = placeholder.src;
            }}
          />
        </div>
      </div>
    </div>
  );
}
