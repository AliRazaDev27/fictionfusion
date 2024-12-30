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
        className="text-lg font-semibold text-white"
      >
        Fiction
        <span className="text-orange-500 text-xl">Fusion</span>
      </Link>
      <Link
        href="/watchlist"
        className={cn(`transition-colors hover:text-foreground`, pathname === "/watchlist" ? "text-white" : "text-white/60")}
      >
        Watchlist
      </Link>
      <Link
        href="/books"
        className={cn(`transition-colors hover:text-foreground`, pathname === "/books" ? "text-white" : "text-white/60")}
      >
        Books
      </Link>
      <Link
        href="/movies"
        className={cn(`transition-colors hover:text-foreground`, pathname === "/movies" ? "text-white" : "text-white/60")}
      >
        Movies
      </Link>
      <Link
        href="/shows"
        className={cn(`transition-colors hover:text-foreground`, pathname === "/shows" ? "text-white" : "text-white/60")}
      >
        Shows
      </Link>
      <Link
        href="/music"
        className={cn(`transition-colors hover:text-foreground`, pathname === "/music" ? "text-white" : "text-white/60")}
      >
        Music
      </Link>
      <div className="flex flex-col  gap-2 py-2 border rounded-2xl">
        <p className="text-xl font-semibold text-white/80">Tasks</p>
        <div className="flex flex-col gap-2">
          <AddTask />
          <ViewTasks />
        </div>
      </div>
    </nav>
  );
}