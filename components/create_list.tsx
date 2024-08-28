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
export  function CreateList({listType}:{listType:string}){
    const handleSumbit = async(formData:FormData) => {
        console.log(formData.get("listName"))
        const listName  = formData.get("listName")
        if(formData.get("listName") === "" || formData.get("listName") === null) return
        const result = await Create(listName as string,listType)
        console.log(result)
    }
    return(
        
        <Dialog>
      <DialogTrigger asChild>
      <button  className="text-lg px-3 py-2  rounded-3xl bg-sky-700">Create New List</button>
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
        </form>
      </DialogContent>
    </Dialog>      
    )
} 