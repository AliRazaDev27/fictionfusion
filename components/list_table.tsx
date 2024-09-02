"use client"
import Link from "next/link"
import { useRef } from "react"
import { MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { DialogClose } from "@radix-ui/react-dialog"
import { useToast } from "./ui/use-toast"
import { updateListName } from "@/actions/listActions"
import { deleteListFromUserList } from "@/actions/userListActions"
export function ListTable({data}){
  const nameRef = useRef<HTMLInputElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const {toast} = useToast()
  const handleUpdate = async() => {
    // add some transition animations
    const name = nameRef.current?.value
    if(!name || name === "") return
    const result = await updateListName(data[0].id,name,"books")
    if(result.success){
      toast({
        title:"List Name Updated",
        duration:2000,
        className:"bg-green-600 text-white",
      })
    }
    else{
      toast({
        title:"Error",
        description:result?.message,
        duration:2500,
        className:"bg-red-600 text-white",
      })
    }
    closeRef.current?.click()
  }
  const handleDelete = async(listId:number,type:string) => {
    const result = await deleteListFromUserList(listId,type,"books")
    if(result.success){
      toast({
        title:"List Deleted",
        duration:2000,
        className:"bg-green-600 text-white",
      })
    }
    else{
      toast({
        title:"Failed to delete list",
        description:result?.message,
        duration:2500,
        className:"bg-red-600 text-white",
      })
    }
  }
    return(
        <div className="text-white">
        <Table>
          <TableHeader>
            <TableRow className="text-lg md:text-xl">
              <TableHead className="text-orange-500">List Name</TableHead>
              <TableHead className="text-orange-500">Item Count</TableHead>
              <TableHead className="text-orange-500">Creator</TableHead>
              <TableHead className="text-orange-500">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data && data.map((item:any,index:number)=>(
                <TableRow className="hover:bg-neutral-800 " key={index} >
              <TableCell><Link href={`/lists/${item.id}`} className="border rounded-full px-4 py-2 font-bold hover:bg-orange-700">{item.listName}</Link></TableCell>
              <TableCell>{item.items?.length || 0}</TableCell>
              <TableCell>{item.creator}</TableCell>
              <TableCell>
              <Dialog>
              <AlertDialog>
              <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem><DialogTrigger>Edit</DialogTrigger></DropdownMenuItem>
                              <DropdownMenuItem><AlertDialogTrigger>Delete</AlertDialogTrigger></DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={()=>handleDelete(item.id,item.type)}>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
                          <DialogContent>
    <DialogHeader>
      <DialogTitle>Change List Name</DialogTitle>
      <DialogDescription hidden/>
    </DialogHeader>
    <div className="flex items-center gap-4 py-2">
      <Label htmlFor="name">Name</Label>
      <Input id="name" name="name" ref={nameRef} />
    </div>
    <div className="flex justify-end space-x-2">
      <Button type="button" onClick={handleUpdate}>Save</Button>
      <DialogClose ref={closeRef}/>
    </div>

  </DialogContent>
  </AlertDialog>
              </Dialog>
              </TableCell>
            </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
    )
}