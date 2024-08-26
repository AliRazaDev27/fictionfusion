"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CircleUser, Menu, Package2, Search } from "lucide-react"
import { cn } from "@/lib/utils"
export default function NavLinksMobile({role}:{role:string}) {
    const pathname = usePathname()
    return (
        <nav className="flex flex-col justify-center text-center gap-6 text-lg font-medium">
              <Link
                href="/"
                className="text-lg font-semibold text-white"
              >
                Fiction
                <span className="text-orange-500 text-xl">Fusion</span>
              </Link>
              {
                role !== "VISITOR" && (
                  <Link
                href="/dashboard"
                className={cn(`transition-colors hover:text-foreground`, pathname === "/dashboard" ? "text-white": "text-white/50")}
              >
                Dashboard
              </Link>
                )
              }
              <Link
                href="/books"
                className={cn(`transition-colors hover:text-foreground`, pathname === "/books" ? "text-white": "text-white/50")}
              >
                Books
              </Link>
              <Link
                href="/movies"
                className={cn(`transition-colors hover:text-foreground`, pathname === "/movies" ? "text-white": "text-white/50")}
              >
                Movies
              </Link>
              <Link
                href="/shows"
                className={cn(`transition-colors hover:text-foreground`, pathname === "/shows" ? "text-white": "text-white/50")}
              >
                Shows
              </Link>
              
            </nav>
    );
}