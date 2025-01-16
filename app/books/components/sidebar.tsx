"use client"
import { SearchControlls } from "@/components/search_controlls";
import { FaFilter } from "react-icons/fa";
import { useRef } from "react";

export function Sidebar() {
    const sidebarRef = useRef<HTMLDivElement>(null);
  return (
    <>
<section ref={sidebarRef} className="bg-red-500 min-w-[300px] h-[calc(100svh-70px)] rounded-tr-xl absolute z-10 -translate-x-full transition-all duration-300 lg:static lg:translate-x-0">
  SIDEBAR
  <div>
<SearchControlls type="books"/>
  </div>
</section>
  <button className="fixed block lg:hidden bottom-4 right-6 p-2 rounded-full bg-black text-emerald-500" onClick={() => sidebarRef.current?.classList.toggle("translate-x-0")}><FaFilter className="size-6"/></button>
</>
  );
}