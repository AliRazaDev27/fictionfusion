"use client"
import Image from "next/image";
import placeholder from "@/public/bookplaceholder.svg"
import { getOpenLibraryAuthorLink, getOpenLibraryCoverLink } from "@/lib";
import RatingStar from "./ratingStar";
import { FaBookOpen } from "react-icons/fa6";
import { Book } from "@/types";
import { Button } from "./ui/button";
export default function BookCard({book}:{book:Book}) {
    return(
        <div className="flex  flex-col md:flex-row gap-8 px-8 my-8">
            <div className="max-w-[300px] md:aspect-[3/4]" style={{position:"relative", height:"400px"}}>
                <Image
                 src={getOpenLibraryCoverLink("olid",book.cover_edition_key,"L")}
                  alt="cover"
                  fill
                  unoptimized
                  placeholder="blur"
                  blurDataURL="/bookplaceholder.svg"
                  style={{objectFit:"cover"}}
                onError={(e) => {
                    e.currentTarget.src = placeholder.src
                  }}
                  />
            </div>
            <div className="flex flex-col justify-evenly w-1/2 border shadow-2xl shadow-black px-4 border-black rounded-3xl">
            <h1 className="text-2xl font-bold">{book.title}</h1>
            <div className="flex items-center gap-8">
            <div className="flex gap-2 items-center">
              <div className="rounded-full flex justify-center items-center size-12 overflow-hidden"><img src={getOpenLibraryAuthorLink("olid",book.author_id,"S")} alt="author_image" width={42} height={42}/></div>
              <p>{book.author_name}</p>
              </div>
            <p>{book.first_publish_year}</p>
            </div>
            <div className="flex gap-8">
            <div>{<RatingStar rating={Number(book.rating)} />}</div>
            <div className="flex justify-center items-center gap-2"><p>{book.number_of_pages} </p><FaBookOpen /></div>
            </div>
            <p>{book.first_sentence}</p>
            <Button className="w-max px-4 py-2">Add to List</Button>
            </div>
          </div>
    ) 
    ;
}