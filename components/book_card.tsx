"use client";
import Image from "next/image";
import {useRef} from "react";
import placeholder from "@/public/bookplaceholder.svg";
import { getAuthorId, getOpenLibraryAuthorLink, getOpenLibraryCoverLink } from "@/lib";
import RatingStar from "./ratingStar";
import { FaBookOpen } from "react-icons/fa6";
import { Book } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoPersonCircle } from "react-icons/io5";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FaPen,  FaTrash } from "react-icons/fa";
import { updateBookInfo } from "@/actions/bookActions";
import { useToast } from "./ui/use-toast";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { AddToList } from "./add_to_list";
import { MdMore } from "react-icons/md";
import { desc } from "drizzle-orm";

export default function BookCard({ book,role,list }: { book: Book,role:string,list?:any }) {
  
  let rating = book?.rating;
  if(!rating) rating = (book as any)?.ratings_average;
  if(!rating) rating = "0"
  const titleRef:any = useRef(undefined)
  const authorRef:any = useRef(undefined)
  const yearRef:any = useRef(undefined)
const sentenceRef:any = useRef(undefined)
  const {toast} = useToast()
  async function updateBook(){
    let title = titleRef?.current?.value
    let author = authorRef?.current?.value
    let year = yearRef?.current?.value
    let sentence = sentenceRef?.current?.value
    if(!title && !author && !year && !sentence) return
    const result = await updateBookInfo(book.id,title,author,year,sentence)
    if(result?.success){
      toast({
        title: "Book Updated Successfully",
        className: "bg-green-600 text-white",
        duration: 1500
      })
    }
    else{
      toast({
        title: "Book Update Failed",
        description: result?.message,
        className: "bg-red-600 text-white",
        duration: 1500
      })
    }
  }
  return (
    <div className="relative group/bookcard border">
      <div
        className="aspect-3/4 rounded-2xl overflow-hidden"
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
      <div className="absolute overflow-hidden top-0 left-0 w-full h-full  scale-0 group-hover/bookcard:scale-100 transition-all duration-500 group-hover/bookcard:flex flex-col gap-5 shadow-md shadow-black px-4 py-4 bg-white/70 rounded-2xl">
        <div className="flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl lg:text-xl  font-semibold italic">{book.title}</h1>
        <div className="flex gap-4 items-center">
          {
            role === "ADMIN" && (
            <Dialog>
          <button><FaTrash/></button>
          <DialogTrigger><FaPen/></DialogTrigger>
          <DialogContent>
            <DialogHeader>
            <DialogTitle className="text-2xl font-light">Edit Book Info</DialogTitle>
            <DialogDescription>
              <div className="flex flex-col gap-4 mt-2">
                <label className="flex gap-4 items-center justify-between text-black text-lg font-semibold" htmlFor="title">Title{""}<input type="text" id="title" name="title" ref={titleRef} placeholder={book?.title} /></label>
                <label className="flex gap-4 items-center justify-between text-black text-lg font-semibold" htmlFor="author">Author{""}<input type="text" id="author" name="author" ref={authorRef} placeholder={book?.author_name} /></label>
                <label className="flex gap-4 items-center justify-between text-black text-lg font-semibold" htmlFor="year">Publish Year{""}<input type="text" id="year" name="year" ref={yearRef} placeholder={book?.first_publish_year} /></label>
                <label className="flex gap-4 items-center justify-between text-black text-lg font-semibold" htmlFor="sentence">First Sentence{""}<textarea rows={4} cols={22}   id="sentence" name="sentence" ref={sentenceRef} placeholder={book?.first_sentence || ""} /></label>
                <button onClick={updateBook} className="ms-auto mt-2 bg-black hover:bg-black/80 text-white px-4 py-2 rounded-md w-max">Save</button>  
              </div>
            </DialogDescription>
            </DialogHeader>

          </DialogContent>
          </Dialog>
          )
          }
        </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex gap-2 items-center">
            
            <div>
              <Avatar className="size-14">
                <AvatarImage src={getOpenLibraryAuthorLink("olid", book.author_id, "S")} className="object-cover object-center" />
                <AvatarFallback><IoPersonCircle className="size-14"/></AvatarFallback>
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
        <div className="border w-min border-black ">
        <button onClick={()=>{
            const description = document.getElementById("description")
            description?.classList.toggle("scale-0")
            description?.classList.toggle("scale-100")
            // description?.classList.toggle("hidden")
            description?.classList.toggle("flex")
        }}>
        <MdMore/>
        </button>
        <div id="description" className="absolute top-0 left-0 w-full h-full hidden scale-0  flex-col gap-5 shadow-md shadow-black px-4 py-4 bg-white/70 rounded-2xl">
        <p className="">{book?.description}</p>
        </div>
        </div>
        </div>
        <div className="flex gap-4">
        {role!=="VISITOR" &&  <AddToList list={list} item={book.id}/>}
        </div>
      </div>
    </div>
  );
}
