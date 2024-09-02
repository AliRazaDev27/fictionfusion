"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreateList as Create } from "@/actions/listActions"
import { useToast } from "./ui/use-toast"
import { DialogClose } from "@radix-ui/react-dialog"
import { useRef } from "react"
export  function CreateList({listType}:{listType:string}){
  const closeRef = useRef<HTMLButtonElement>(null)
  const {toast} = useToast()
    const handleSumbit = async(formData:FormData) => {
        console.log(formData.get("listName"))
        const listName  = formData.get("listName")
        if(formData.get("listName") === "" || formData.get("listName") === null) return
        const result = await Create(listName as string,listType)
        if(result.success){
            toast({
                description: "List created",
                duration: 1500,
                className: "bg-green-600 text-white"
              })
        }
        else{
            toast({
                description: "Error creating list",
                duration: 2500,
                className: "bg-red-600 text-white"
              })
        }
        closeRef.current?.click()
        
    }
    return(
        
        <Dialog>
      <DialogTrigger asChild>
      <button  className="text-lg px-3 py-2  rounded-3xl bg-orange-500 border hover:bg-orange-600">Create New List</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
      <form action={handleSumbit}>
        <DialogHeader>
          <DialogTitle>Create List</DialogTitle>
          <DialogDescription>
            Make a new list to organize your books.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              List Name
            </Label>
            <Input
              id="name"
              name="listName"
              defaultValue=""
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Create</Button>
        </DialogFooter>
        <DialogClose ref={closeRef}/>
        </form>
      </DialogContent>
    </Dialog>      
    )
} 