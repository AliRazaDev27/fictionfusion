"use client"
import { Search } from "lucide-react"
import { useRef,useEffect } from "react"
import { Input } from "./ui/input"
import { useRouter } from "next/navigation"
export function SearchBar() {
    const router = useRouter()
    const searchRef = useRef<HTMLInputElement>(null)
    const handleCtrlK = (e: KeyboardEvent) => {
        if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
            console.log("k pressed")
            e.preventDefault()
            searchRef.current?.focus()
          }
    }
    const handleEnterAndEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            searchRef.current?.blur()
          }
          if (e.key === "Enter") {
            e.preventDefault()
            const value = searchRef.current?.value
            searchRef.current.value = ""
            searchRef.current?.blur()
            router.push(`/search/shows?query=${value}`)
          }
    }
  useEffect(() => {

    window.addEventListener("keydown", handleCtrlK)
    return () => {
      window.removeEventListener("keydown", handleCtrlK)
    }
  },[])
  useEffect(() => {
    searchRef.current?.addEventListener("keydown", handleEnterAndEscape)
    return () => {
      searchRef.current?.removeEventListener("keydown", handleEnterAndEscape)
    }
  },[])
  return(
    <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              {/*  TODO: Add search mode for db and api */}
              <Input
                type="search"
                ref={searchRef}
                
                placeholder="Search ..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form>
  )
} 