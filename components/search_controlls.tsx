"use client"
import { useSearchParams, usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import { useState,useEffect,useRef, MutableRefObject } from "react"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Label } from "./ui/label"
import { getSortOptions } from "@/lib/utils"

export function SearchControlls({type}:{type:string}) {
  const searchParams = useSearchParams()
  const path = usePathname()
  const searchTerm = searchParams.get("search")
  const sortTerm = searchParams.get("sort")
  const router = useRouter()
  const [sortOption, setSortOption] = useState(sortTerm || "year_newest")
  const [search, setSearch] = useState(searchTerm || "")
 const sortOptions = getSortOptions(type)
  
 
  function handleFilter() {
    const data:any = {
      page: 1,
      search: search,
      sort: sortOption,
    }
    router.push(`${path.toString()}?${new URLSearchParams(data).toString()}`)
  }
  function handleReset() {
    setSearch("")
    setSortOption("")
    router.push(`${path}`)
    router.refresh()
  }
  const handleDelete = async () => {
  }

  return (
    (<div
      className="flex flex-col border items-center py-3 gap-4 bg-background w-full mx-auto rounded-lg shadow-lg">
      <div className="w-[90%] flex-1">
        <Input
          type="search"
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.currentTarget.blur();
              handleFilter();
            }
          }}
          placeholder="Search products..."
          className="w-full rounded-md bg-muted" />
      </div>
      <div className="flex items-center gap-4 justify-center">
        <Label>Sort By</Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <span>{sortOptions.find((option) => option.value === sortOption)?.label || "Sort"}</span>
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px]">
            {sortOptions.map((option) => (
              <DropdownMenuItem key={option.value} onSelect={() => setSortOption(option.value)}>
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex flex-wrap justify-center gap-4 items-center ">
        <Button className="bg-red-500 text-white" onClick={() => handleReset()}>Reset</Button>
        <Button className="bg-blue-500 text-white" onClick={() => handleFilter()}>Filter</Button>

        <Button className="bg-red-500 text-white" onClick={() => handleDelete()}>Delete</Button>
      </div>
    </div>)
  );
}

function ChevronDownIcon(props) {
  return (
    (<svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="m6 9 6 6 6-6" />
    </svg>)
  );
}