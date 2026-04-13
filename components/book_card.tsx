"use client";
import Image from "next/image";
<<<<<<< HEAD
import { getAuthorId, getOpenLibraryAuthorLink, getOpenLibraryCoverLink } from "@/lib";
import { FaBookOpen } from "react-icons/fa6";
import { Book } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoPersonCircle } from "react-icons/io5";
import { MdFavoriteBorder, MdMore } from "react-icons/md";
import { MdDone } from "react-icons/md";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";
=======
import placeholder from "@/public/bookplaceholder.svg";
import { getOpenLibraryCoverLink } from "@/lib";
import { Book } from "@/types";
import React from "react";
import { MdOutlineDateRange } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
import { IoBookOutline } from "react-icons/io5";

>>>>>>> f370ba3651d66ac7da1301f305bfefe6c0b19222

export default function BookCard({ book }: { book: Book }) {
  const rating = book?.rating ?? (book as any)?.ratings_average ?? "0";
  console.log(book);
  return (
<<<<<<< HEAD
    <div className="2xl:max-w-7xl w-full flex items-center rounded-3xl overflow-hidden shadow-2xl shadow-neutral-600">
      <div
        className="w-1/3 relative aspect-3/4"
      >
        <Image
          src={getOpenLibraryCoverLink(book.cover_edition_key) || "/bookplaceholder.svg"}
          alt="cover"
          quality={100}
          // placeholder="blur"
          // blurDataURL="/bookplaceholder.svg"
          style={{ objectFit: "cover", objectPosition: "center" }}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <Dialog>
          <DialogTrigger asChild>
        <button><FaBookOpen className="absolute bottom-4 right-0 left-0 mx-auto size-8 cursor-pointer hover:text-teal-300" /></button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Gallery</DialogTitle>
            <DialogDescription className="sr-only">
              Book Covers Gallery
            </DialogDescription>
            <div>
              {
                book?.covers?.map((cover: any) => {
                  return (
                    <Image
                      key={cover.key}
                      src={getOpenLibraryCoverLink(cover.key) || "/bookplaceholder.svg"}
                      alt="cover"
                      quality={100}
                      // placeholder="blur"
                      // blurDataURL="/bookplaceholder.svg"
                      style={{ objectFit: "cover", objectPosition: "center" }}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  )
              }
                )
              }
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="relative overflow-y-auto w-full aspect-[2.26] flex flex-col gap-5 p-2 bg-neutral-300">
        <h1 className="text-2xl  font-extrabold text-neutral-600">{book.title}</h1>
        <div className="absolute top-3 right-3  flex  gap-2">
          <button className="p-2 bg-white rounded-full "><MdFavoriteBorder className="size-6" /></button>
          <button className="p-2 bg-white rounded-full "><MdDone className="size-6" /></button>
        </div>
        <div className="flex gap-1 items-center">
          <Avatar className="size-12 md:size-14">
            <AvatarImage src={getOpenLibraryAuthorLink("olid", book?.author_key ? book?.author_key[0] : null, "M")} className="object-cover object-center" />
            <AvatarFallback><IoPersonCircle className="size-14" /></AvatarFallback>
          </Avatar>
          <Link href={`/author/${getAuthorId(book?.author_key![0])}`} prefetch={false} className="px-2 py-1  hover:bg-blue-600 hover:no-underline hover:rounded-2xl text-lg font-semibold underline underline-offset-4 transition-color duration-500">{book.author_name}</Link>
        </div>
        <div className="flex gap-8 ps-2 items-center">
          <p className="font-semibold">{book.first_publish_year}</p>
          <div className="flex gap-2 items-center">
            <Badge className="text-sm">{Number(rating).toFixed(2)}</Badge>
          </div>
          <div className="flex justify-center items-center gap-2">
            <p className="text-md">{book.number_of_pages} </p>
            <FaBookOpen />
          </div>
        </div>
        <div className="w-full">
          <Dialog>
            <DialogTrigger>
          <p className="line-clamp-3 text-start cursor-pointer">{book?.description}
          </p>
            </DialogTrigger>
            <DialogContent className="w-[60em]">
              <DialogTitle>{book.title}</DialogTitle>
              <DialogDescription className="text-base lg:text-lg font-medium font-sans text-neutral-600">{book?.description}</DialogDescription>
            </DialogContent>
          </Dialog>
        </div>
        {
          book?.tags && book?.tags.length > 0 && (
            <div className="flex gap-2">
              <p>Tags:</p>
              <div className="flex gap-2 items-center flex-wrap">
                {book?.tags?.map((tag: any, index: number) => (
                  <Badge key={index} className="text-sm cursor-pointer">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
=======
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

>>>>>>> f370ba3651d66ac7da1301f305bfefe6c0b19222
      </div>
    </div>
  );
}
