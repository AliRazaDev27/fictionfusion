"use client"
import { useToast } from "./ui/use-toast";
import { addMovieToDB } from "@/actions/movieActions";
import { Button } from "./ui/button";


export function AddMovieToDB({movie}:{movie:any}){
    const { toast } = useToast()
    const handleAdd = async() => {
        const result = await addMovieToDB(movie)
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
        <Button className="absolute bg-gray-700 bottom-2 right-5" onClick={handleAdd}>Add to DB</Button>
    )
}