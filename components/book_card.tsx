"use client";
import Image from "next/image";
import placeholder from "@/public/bookplaceholder.svg";
import { getOpenLibraryCoverLink } from "@/lib";
import { Book } from "@/types";
import React from "react";
import { MdOutlineDateRange } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
import { IoBookOutline } from "react-icons/io5";


export default function BookCard({ book }: { book: Book }) {
  const rating = book?.rating ?? (book as any)?.ratings_average ?? "0";
  console.log(book);
  return (
    <div className="relative w-full h-full group overflow-hidden rounded-2xl">
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
      <div className="bg-slate-950 text-white px-4 py-4 w-full h-full flex flex-col gap-3 absolute group-hover:inset-0 ">
            <p className="text-3xl">{book.title}</p>
            <p>{book.author_name}</p>
            <div className="flex justify-between items-center">
              <p className="flex items-center gap-1">
                <MdOutlineDateRange />{book.first_publish_year}</p>
              <p className="flex items-center gap-1">
                <FaRegStar />
                {rating}</p>
              <p className="flex items-center gap-1">
                <IoBookOutline />
                {book.number_of_pages}</p>
            </div>
            <p className="line-clamp-5">{book.description}</p>

      </div>
    </div>
  );
}
