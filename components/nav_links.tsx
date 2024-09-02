"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CircleUser, Menu, Package2, Search } from "lucide-react"
import { cn } from "@/lib/utils"

export default function NavLinks({role}:{role:string}) {
    const pathname = usePathname()
  
    return (
        <nav className="hidden translate-x-8  text-lg font-medium md:flex md:flex-row md:items-center md:gap-2  lg:gap-4">
         
          { role !== "VISITOR" && (
            <Link
            href="/dashboard"
            className={cn(`transition-colors hover:text-foreground`, pathname === "/dashboard" ? "text-white font-semibold": "text-white/60 ")}
          >
            Dashboard
          </Link>)
          }
          <Link
            href="/books"
            className={cn(`transition-colors hover:text-foreground`, pathname === "/books" ? "text-white font-semibold": "text-white/60")}
          >
            Books
          </Link>
          <Link
            href="/movies"
            className={cn(`transition-colors hover:text-foreground`, pathname === "/movies" ? "text-white font-semibold": "text-white/60")}
          >
            Movies
          </Link>
          <Link
            href="/shows"
            className={cn(`transition-colors hover:text-foreground`, pathname === "/shows" ? "text-white font-semibold": "text-white/60")}
          >
            Shows
          </Link>
          
        </nav>
    )
}