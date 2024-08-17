"use client"
import { useToast } from "./ui/use-toast";
import { deleteShowByID } from "@/actions/showActions"
import { FaTrashCan } from "react-icons/fa6"
export function DeleteShow({id}:{id:number}) {
    const {toast} = useToast()
    const handleDelete = async() => {
        const result = await deleteShowByID(id)
        if(result.success){
            toast({
                title: "Show deleted",
                duration: 1000,
                className: "bg-green-600 text-white",
            })
        }
    }
    return(
        <button onClick={handleDelete}><FaTrashCan className="absolute top-5 right-8 size-6"/></button>
    )
}
