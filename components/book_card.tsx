"use client"
import Image from "next/image";
import placeholder from "@/public/bookplaceholder.svg"
import { getOpenLibraryCoverLink } from "@/lib";
import RatingStar from "./ratingStar";
import { FaBookOpen } from "react-icons/fa6";
import { Book } from "@/types";
import { Button } from "./ui/button";
export default function BookCard({book}:{book:Book}) {
    return(
        <div className="flex border border-red-500 flex-col md:flex-row gap-8 px-8">
            <div className="border-2  max-w-[300px] md:aspect-[3/4] border-green-500" style={{position:"relative", height:"400px"}}>
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
            <div className="flex flex-col  justify-evenly ">
            <h1 className="text-2xl font-bold">{book.title}</h1>
            <div className="flex gap-8">
            <p>{book.author}</p>
            <p>{book.first_publish_year}</p>
            </div>
            <div className="flex gap-8">
            <div>{<RatingStar rating={Number(book.rating)} />}</div>
            <div className="flex justify-center items-center gap-2"><p>{book.number_of_pages} </p><FaBookOpen /></div>
            </div>
            <p>{book.first_sentence}</p>
            <Button>Add to List</Button>
            </div>
          </div>
    ) 
    ;
}