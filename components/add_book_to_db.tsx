"use client"
import { useToast } from "./ui/use-toast";
import { addBookToDB } from "@/actions/bookActions";
import { Button } from "./ui/button";
import { Book } from "@/lib/database/bookSchema";


export function AddBookToDB({book}:{book:Book}){
    const handleAdd = async() => {
    }
    return(
        <Button className="w-min ms-auto bg-black/80 hover:bg-green-600  text-white" onClick={handleAdd}>Add to DB</Button>
    )
}