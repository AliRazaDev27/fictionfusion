"use client";
import Image from "next/image";
import {useState,useRef, MutableRefObject} from "react";
import placeholder from "@/public/bookplaceholder.svg";
import { getAuthorId, getOpenLibraryAuthorLink, getOpenLibraryCoverLink } from "@/lib";
import RatingStar from "./ratingStar";
import { FaBookOpen, FaTrashCan } from "react-icons/fa6";
import { Book } from "@/types";
import { Button } from "./ui/button";
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
import { FaArrowCircleLeft, FaArrowCircleRight,  FaPen,  FaTrash } from "react-icons/fa";
import { deleteImageFromGallery, setBookCoverImage, updateBookInfo } from "@/actions/bookActions";
import { useToast } from "./ui/use-toast";
import Link from "next/link";
import { removeEmptyImages } from "@/actions/cleaner";
import { Badge } from "./ui/badge";

export default function BookCard({ book,role }: { book: Book,role:string }) {
  let rating = book?.rating;
  if(!rating) rating = (book as any)?.ratings_average;
  if(!rating) rating = "0"
  if(!book?.olid) book.olid = (book as any)?.edition_key;
  const titleRef:any = useRef()
  const authorRef:any = useRef()
  const yearRef:any = useRef()
const sentenceRef:any = useRef()
  const {toast} = useToast()
  const [currentGalleryImageIndex, setCurrentGalleryImageIndex] = useState(0);
  function nextGalleryImage() {  
    if((currentGalleryImageIndex+1) === book?.olid?.length){
      console.log("last image")
    }
    else{
      setCurrentGalleryImageIndex(currentGalleryImageIndex + 1);
    }
    
  }
  function previousGalleryImage() {
    if(currentGalleryImageIndex === 0){
      console.log("first image")
    }
    else{
      setCurrentGalleryImageIndex(currentGalleryImageIndex - 1);
    }
  }
  async function saveImageAsCover(){
    console.log(book.cover_edition_key)
    const imageIndex = book?.olid && book?.olid[currentGalleryImageIndex]
    if(!imageIndex) return
    const result = await setBookCoverImage(imageIndex,book.id)
    if(result.success){
      toast({
        title: "Image Saved Successfully",
        className: "bg-green-600 text-white",
        duration: 1500
      })
    }
    else{
      toast({
        title: "Image Saving Failed",
        description: result.message,
        className: "bg-red-600 text-white",
        duration: 1500
      })
    }
  }
  async function deleteImage(){
    const imageIndex = book?.olid && book?.olid[currentGalleryImageIndex]
    if(!imageIndex) return
      const result = await deleteImageFromGallery(imageIndex,book.id)
      if(result?.success){
        toast({
          title: "Image Deleted Successfully",
          className: "bg-green-600 text-white",
          duration: 1500
        })
      }
      else{
        toast({
          title: "Image Deletion Failed",
          description: result?.message,
          className: "bg-red-600 text-white",
          duration: 1500
        })
      }
      
  }
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
    <div className="flex  flex-col md:flex-row gap-8 max-md:items-center  my-8 ">
      <div
        className="min-w-[300px] md:aspect-[3/4] rounded-2xl overflow-hidden"
        style={{ position: "relative", height: "400px" }}
      >
        <Image
          src={getOpenLibraryCoverLink("olid", book.cover_edition_key, "M")}
          alt="cover"
          fill
          unoptimized
          placeholder="blur"
          blurDataURL="/bookplaceholder.svg"
          style={{ objectFit: "cover" }}
          onError={(e) => {
            e.currentTarget.src = placeholder.src;
          }}
        />
        <Dialog>
        <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 ${book?.olid?.length === 0 ? "hidden" : ""}`}><DialogTrigger className="hover:bg-black bg-black/80 text-white px-4 py-2 rounded-xl">Open Gallery</DialogTrigger></div>
        <DialogContent>
    <DialogHeader>
      <DialogTitle className="text-2xl font-light">Gallery {currentGalleryImageIndex + 1} / {book?.olid && book?.olid.length}</DialogTitle>
      <DialogDescription>
        <div className="relative flex justify-center w-full h-full overflow-hidden">
        <div className="w-80 aspect-[3/4]">
          <img src={getOpenLibraryCoverLink("olid", book?.olid && book.olid[currentGalleryImageIndex], "M")} alt="gallery" className="w-full h-full"/>
        </div>
        <div className="absolute top-1/2 right-0  -translate-y-1/2"><button onClick={nextGalleryImage}><FaArrowCircleRight className="size-8 hover:text-black/80"/></button></div>
        <div className="absolute top-1/2 left-0  -translate-y-1/2"><button onClick={previousGalleryImage}><FaArrowCircleLeft className="size-8 hover:text-black/80 "/></button></div>
        {role === "ADMIN" && (
          <div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 "><Button onClick={saveImageAsCover} className="hover:bg-black">Save as Cover</Button></div>
            <div className="absolute top-0 right-4"><button onClick={deleteImage}><FaTrashCan className="size-8 hover:text-black/80"/></button></div>
          </div>
        )}
        </div>

      </DialogDescription>
    </DialogHeader>
  </DialogContent>
        </Dialog>
      </div>
      <div className="flex flex-col justify-evenly w-full min-h-80  shadow-md shadow-black px-4 bg-white/80 rounded-2xl">
        <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-3xl  italic font-light">{book.title}</h1>
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
            <Link href={`/author/${getAuthorId(book.author_id)}`} prefetch={false} className="hover:bg-blue-500 text-xl underline">{book.author_name}</Link>
          </div>
          <p className="font-semibold">{book.first_publish_year}</p>
        </div>
        <div className="flex gap-8">
          <div className="flex gap-2 items-center">
            <Badge className="text-sm">{Number(rating).toFixed(2)}</Badge>
            <RatingStar rating={Number(rating)} />
          </div>
          <div className="flex justify-center items-center gap-2">
            <p className="text-md">{book.number_of_pages} </p>
            <FaBookOpen />
          </div>
        </div>
        <p className="line-clamp-3">{book.first_sentence}</p>
        <div className="flex gap-4">
        {role!=="VISITOR" &&  <Button className="w-max px-4 py-2">Add to List</Button>}
        {role==="ADMIN" && <Button className="w-max px-4 py-2" onClick={async()=>await removeEmptyImages(book.id,book?.olid)}>Clean</Button>}
        </div>
      </div>
    </div>
  );
}
