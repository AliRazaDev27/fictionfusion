"use client"
import { addItemToList } from "@/actions/listActions"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { useToast } from "./ui/use-toast"
import { Label } from "@/components/ui/label"
import { useEffect, useState,useRef } from "react"
export function AddToList({list,item}) {
  const [checked,setChecked] = useState(new Array(list?.length))
  const [initial,setInitial] = useState(new Array(list?.length))
  const closeRef = useRef<HTMLButtonElement>(null)
  const { toast } = useToast()
  useEffect(()=>{
    for(let i=0 ;i<list?.length;i++){
      let content = list[i]
      if(!content.items) continue
      if(content.items.includes(item)){
        const temp = checked
        temp[i] = true
        setChecked(temp)
        setInitial(temp)
      }
    }
  },[])
  const handleSave = async () => {
    // for now only add items, not remove.
    const addLists:number[] = []
    for(let i = 0;i<checked?.length;i++){
      if(checked[i] && !initial[i]){
        addLists.push(list[i].id)
      }
    }
    for(let id of addLists){
      // what happens when adding to multiple lists
      const result = await addItemToList(id,item)
      if(result.success){
        toast({
          description: "Item added to list",
          duration: 1500,
          className: "bg-green-600 text-white"
        })
      }
      else{
        toast({
          description: "Error adding item to list",
          duration: 2500,
          className: "bg-red-600 text-white"
        })
      }
    }
    closeRef.current?.click()
  }
  return(
        <Dialog>
      <DialogTrigger asChild>
        <Button  className="w-max bg-orange-600 hover:bg-orange-700">ADD</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add to your list</DialogTitle>
          <DialogDescription>
            Click save to finalize the changes.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {list && list.map((listItem,index)=>(
            <div className="flex items-center gap-4" key={index}>
            <Checkbox id={`name${index}`} defaultChecked={checked[index]} onCheckedChange={e=>setChecked([...checked.slice(0,index),e,...checked.slice(index+1)])}/>
              <Label htmlFor={`name${index}`} className="text-right">
                {listItem.listName}
              </Label>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSave}>Save changes</Button>
          <DialogClose ref={closeRef}/>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    )
}