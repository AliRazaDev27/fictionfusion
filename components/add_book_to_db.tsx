"use client"
import { useToast } from "./ui/use-toast";
import { addBookToDB } from "@/actions/bookActions";
import { Button } from "./ui/button";


export function AddBookToDB({book}:{book:any}){
    const { toast } = useToast()
    const handleAdd = async() => {
        const result = await addBookToDB(book)
        if(result.success){
            toast({
                title: "Added to DB",
                className: "bg-green-600 text-white",
                duration: 1000
              })
        }
        else{
            toast({
                title: "Failed to Add",
                description: result.message,
                className: "bg-red-600 text-white",
                duration: 2000
              })
        }
    }
    return(
        <Button className="absolute bottom-5 right-5" onClick={handleAdd}>Add to DB</Button>
    )
}