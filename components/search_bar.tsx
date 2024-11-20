"use client";
import { Search } from "lucide-react";
import { useState,useRef, useEffect } from "react";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "./ui/badge";
export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [searchType, setSearchType] = useState("");
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const handleCtrlK = (e: KeyboardEvent) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      searchRef.current?.focus();
    }
  };
  const handleEnterAndEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      searchRef.current?.blur();
    }
    if (e.key === "Enter") {
      e.preventDefault();
      setOpen(true);
    }
  };
  useEffect(() => {
    if(searchType !== "" ){
      const type = searchType
      const value = searchRef.current?.value
      if (searchRef.current?.value) searchRef.current.value = "";
      searchRef.current?.blur();
      setSearchType("")
      setOpen(false)
      router.push(`/search/${type}?query=${value}`)
    }
  },[searchType])
  useEffect(() => {
    window.addEventListener("keydown", handleCtrlK);
    return () => {
      window.removeEventListener("keydown", handleCtrlK);
    };
  }, []);
  useEffect(() => {
    searchRef.current?.addEventListener("keydown", handleEnterAndEscape);
    return () => {
      searchRef.current?.removeEventListener("keydown", handleEnterAndEscape);
    };
  }, []);
  return (
    <form className="ml-auto  flex-1 sm:flex-initial">
        <DropdownMenu open={open}>
        {/*  TODO: Add search mode for db and api */}
        <div className=" flex relative group  border border-black/40 rounded-lg items-center group">
        <DropdownMenuTrigger/>
        <Search className="absolute pointer-events-none left-2.5 top-2.5 h-5 w-5 text-gray-600" />
        <Input
          type="search"
          ref={searchRef}
          placeholder="Search API..."
          className="pl-8 w-[0px] focus:w-full  text-black"
        />
        <Badge className="hidden absolute right-4 group-focus-within:hidden">CtrlK</Badge>
        </div>  
          <DropdownMenuContent side="bottom" sideOffset={8} align="start" alignOffset={8} className="w-full text-center border border-black/50" onInteractOutside={() => setOpen(false)}>
            <DropdownMenuLabel>Search in...</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="data-[highlighted]:bg-blue-400 justify-center text-md" onClick={() => setSearchType("books")} onKeyDown={(e) => {e.key === "Enter" && setSearchType("books") }}>Books</DropdownMenuItem>
            <DropdownMenuItem className="data-[highlighted]:bg-blue-400 justify-center text-md" onClick={() => setSearchType("shows")}  onKeyDown={(e) => {e.key === "Enter" && setSearchType("shows") }}>Shows</DropdownMenuItem>
            <DropdownMenuItem className="data-[highlighted]:bg-blue-400 justify-center text-md" onClick={() => setSearchType("movies")}  onKeyDown={(e) => {e.key === "Enter" && setSearchType("movies") }}>Movies</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
    </form>
  );
}
