"use client"
import { addShow } from "@/actions/showActions";
import { Button } from "./ui/button";
import { Show } from "@/types";
import { useToast } from "./ui/use-toast"; 

export function AddShowToDB({show}:{show:Show}) {
    const { toast } = useToast()
    const handleAdd = async() => {
        const result = await addShow(show)
        if(result.success){
            toast({
                title: "Show added",
                description: "Show added successfully",
                duration: 1000,
                className: "bg-green-600 text-white",
            })
        }
        else{
            toast({
                title: "Failed to Add",
                description: result.message,
                duration: 2000,
                className: "bg-red-600 text-white",
            })
        }
    }
    return(
 <Button className="absolute top-5 right-8" onClick={handleAdd}>Add to DB</Button>           
    )
}