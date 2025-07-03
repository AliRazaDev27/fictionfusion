"use client";
import Image from "next/image";
import placeholder from "@/public/bookplaceholder.svg";
import { getAuthorId, getOpenLibraryAuthorLink, getOpenLibraryCoverLink } from "@/lib";
import { FaBookOpen } from "react-icons/fa6";
import { Book } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoPersonCircle } from "react-icons/io5";

import Link from "next/link";
import { Badge } from "./ui/badge";

export default function BookCard({ book }: { book: Book }) {

  let rating = book?.rating;
  if (!rating) rating = (book as any)?.ratings_average;
  if (!rating) rating = "0"
  return (
    <div className="relative group/bookcard rounded-2xl border border-white/30 h-min">
      <div
        className="relative aspect-3/4 rounded-2xl overflow-hidden"
      >
        <Image
          src={getOpenLibraryCoverLink("olid", book.cover_edition_key, "M")}
          alt="cover"
          fill
          quality={100}
          placeholder="blur"
          blurDataURL="/bookplaceholder.svg"
          style={{ objectFit: "cover" }}
          onError={(e) => {
            e.currentTarget.src = placeholder.src;
          }}
        />
      </div>
      <div className="absolute overflow-y-auto top-0 left-0 w-full h-full  scale-0 group-hover/bookcard:scale-100 transition-all duration-500 group-hover/bookcard:flex flex-col gap-4 shadow-md shadow-black px-4 py-4 bg-white/90 rounded-2xl">
        <div className="flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl lg:text-xl  font-semibold italic">{book.title}</h1>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex gap-2 items-center">

            <div>
              <Avatar className="size-14">
                <AvatarImage src={getOpenLibraryAuthorLink("olid", book.author_id, "S")} className="object-cover object-center" />
                <AvatarFallback><IoPersonCircle className="size-14" /></AvatarFallback>
              </Avatar>
            </div>
            {/* TODO: some beautiful animation here */}
            <Link href={`/author/${getAuthorId(book.author_id)}`} prefetch={false} className="px-2 py-1  hover:bg-blue-600 hover:no-underline hover:rounded-2xl text-base underline underline-offset-4 transition-color duration-500">{book.author_name}</Link>
          </div>
        </div>
        <div className="flex justify-evenly items-center">
          <p className="font-semibold">{book.first_publish_year}</p>
          <div className="flex gap-2 items-center">
            <Badge className="text-sm">{Number(rating).toFixed(2)}</Badge>
          </div>
          <div className="flex justify-center items-center gap-2">
            <p className="text-md">{book.number_of_pages} </p>
            <FaBookOpen />
          </div>
        </div>
        <div>
          <p className="">{book.first_sentence}</p>
          {/*  add proper style for description. */}
          <div className="w-full mt-4">
              <p className="">{book?.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
