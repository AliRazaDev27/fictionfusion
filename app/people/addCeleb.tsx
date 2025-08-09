"use client"

import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { MdAdd } from "react-icons/md"
import { Button } from "@/components/ui/button"
import { useRef } from "react"
import { setupCelebInfo } from "@/actions/celebActions"

export function AddCeleb() {
  const urlRef = useRef<HTMLInputElement>(null)
  const handleSave = async() => {
    const url = urlRef.current?.value
    if(!url) return
    const response = await setupCelebInfo(url)
    console.log(response);
  }
  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer hover:bg-green-700 bg-black text-white p-3 rounded-full absolute bottom-6 right-6">
        <MdAdd />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Celebrity</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input placeholder="URL of Celebrity page" ref={urlRef} />
          <div className="ml-auto">
            <DialogClose className="cursor-pointer hover:bg-green-600 px-3 py-2 rounded-lg bg-black text-white" onClick={handleSave}>Save</DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}