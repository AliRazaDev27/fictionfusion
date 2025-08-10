"use client"

import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { MdAdd } from "react-icons/md"
import { Button } from "@/components/ui/button"
import { setupCelebInfo } from "@/actions/celebActions"
import { useState } from "react"

export function AddCeleb() {
  const [url, setUrl] = useState("")
  const handleSave = async () => {
    if (!url) return
    await setupCelebInfo(url)
  }
  const handleOpen = async () => {
    const text = await navigator.clipboard.readText()
    setUrl(text)
  }
  return (
    <Dialog>
      <DialogTrigger
        onClick={handleOpen}
        className="cursor-pointer hover:bg-green-600 transition-all duration-300 hover:scale-125 bg-neutral-800 text-white p-3 rounded-full fixed bottom-6 right-6"
      >
        <MdAdd className="text-2xl" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Celebrity</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Input
            placeholder="URL of Celebrity page"
            value={url}
            onChange={e => setUrl(e.target.value)}
          />
          <div className="ml-auto">
            <DialogClose
              className="cursor-pointer hover:bg-green-600 px-3 py-2 rounded-lg bg-black text-white"
              onClick={handleSave}
            >
              Save
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
