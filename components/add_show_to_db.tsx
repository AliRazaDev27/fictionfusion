"use client"
import { addShow } from "@/actions/showActions";
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
 <button className="bg-black px-4 py-2 text-white rounded-xl hover:bg-orange-600" onClick={handleAdd}>Add to DB</button>           
    )
}