"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
                className={cn(`transition-colors hover:text-foreground`, pathname === "/dashboard" ? "text-white": "text-white/60")}
              >
                Dashboard
              </Link>
                )
              }
              {
                role !== "VISITOR" && (
                  <Link
                href="/watchlist"
                className={cn(`transition-colors hover:text-foreground`, pathname === "/watchlist" ? "text-white": "text-white/60")}
              >
                Watchlist
              </Link>
                )
              }
              <Link
                href="/books"
                className={cn(`transition-colors hover:text-foreground`, pathname === "/books" ? "text-white": "text-white/60")}
              >
                Books
              </Link>
              <Link
                href="/movies"
                className={cn(`transition-colors hover:text-foreground`, pathname === "/movies" ? "text-white": "text-white/60")}
              >
                Movies
              </Link>
              <Link
                href="/shows"
                className={cn(`transition-colors hover:text-foreground`, pathname === "/shows" ? "text-white": "text-white/60")}
              >
                Shows
              </Link>
              <Link
                href="/music"
                className={cn(`transition-colors hover:text-foreground`, pathname === "/music" ? "text-white": "text-white/60")}
              >
                Music
              </Link>
            </nav>
    );
}