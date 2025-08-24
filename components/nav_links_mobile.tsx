"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { AddTask } from "./add-task"
import { ViewTasks } from "./view-tasks"
export default function NavLinksMobile() {
  const pathname = usePathname()
  return (
    <nav className="flex flex-col justify-center text-center gap-6 text-lg font-medium">
      <Link
        href="/"
        prefetch={false}
        className="text-lg font-semibold text-white"
      >
        Fiction
        <span className="text-orange-500 text-xl">Fusion</span>
      </Link>
      <Link
        href="/watchlist"
        prefetch={false}
        className={cn(`transition-colors hover:text-foreground`, pathname === "/watchlist" ? "text-white" : "text-white/60")}
      >
        Watchlist
      </Link>
      <Link
        href="/celebs"
        prefetch={false}
        className={cn(`transition-colors hover:text-foreground`, pathname === "/celebs" ? "text-white" : "text-white/60")}
      >
        Celebs
      </Link>
      <Link
        href="/books"
        prefetch={false}
        className={cn(`transition-colors hover:text-foreground`, pathname === "/books" ? "text-white" : "text-white/60")}
      >
        Books
      </Link>
      <Link
        href="/movies"
        prefetch={false}
        className={cn(`transition-colors hover:text-foreground`, pathname === "/movies" ? "text-white" : "text-white/60")}
      >
        Movies
      </Link>
      <Link
        href="/shows"
        prefetch={false}
        className={cn(`transition-colors hover:text-foreground`, pathname === "/shows" ? "text-white" : "text-white/60")}
      >
        Shows
      </Link>
      <Link
        href="/music"
        prefetch={false}
        className={cn(`transition-colors hover:text-foreground`, pathname === "/music" ? "text-white" : "text-white/60")}
      >
        Music
      </Link>

      <div>
        <Link
          href='/recgen'
          prefetch={false}
          className={cn(`text-lg transition-colors duration-100 hover:text-orange-500`, pathname === '/recgen' ? "text-white font-semibold" : "text-white/60")}>
          RecGen
        </Link>
      </div>
    </nav>
  );
}