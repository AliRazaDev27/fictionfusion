"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { AddTask } from "./add-task"
import { ViewTasks } from "./view-tasks"

const links = [
  { href: "/books", label: "Books" },
  { href: "/movies", label: "Movies" },
  { href: "/shows", label: "Shows" },
  { href: "/music", label: "Music" },
]

export default function NavLinks() {
  const pathname = usePathname()

  return (
    <nav className="hidden text-lg font-medium md:flex md:flex-row md:items-center md:gap-4">
      <div className="relative group cursor-pointer px-1 py-3">
        <p className="text-white/60 text-xl">Track</p>
        <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 z-50 bg-linear-to-b from-gray-950 to-blue-950 border border-white/50 px-6 py-6 mt-2 rounded-lg">
          <div className="flex flex-col items-center gap-4">
            <Link
              href="/watchlist"
              prefetch={false}
              className={cn(`transition-colors duration-100 hover:text-orange-500 text-xl`, pathname === "/watchlist" ? "text-white font-semibold" : "text-white/60 ")}
            >
              Watchlist
            </Link>
            <Link
              href="/celebs"
              prefetch={false}
              className={cn(`transition-colors duration-100 hover:text-orange-500 text-xl`, pathname === "/celebs" ? "text-white font-semibold" : "text-white/60 ")}
            >
              Celebs
            </Link>
          </div>
        </div>
      </div>
      <div className="relative group cursor-pointer px-1 py-3">
        <p className="text-white/60 text-xl">Explore</p>
        <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 z-50 bg-linear-to-b from-gray-950 to-blue-950 border border-white/50 px-6 py-6 mt-2 rounded-lg">
          <div className="flex flex-col items-center gap-4">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                prefetch={false}
                className={cn(`transition-colors duration-100 hover:text-orange-500`, pathname === href ? "text-white font-semibold" : "text-white/60")}
              >
                {label}
              </Link>
            ))
            }
          </div>
        </div>
      </div>
      <div className="relative group cursor-pointer px-1 py-3">
        <p className="text-white/60 text-xl">Tasks</p>

        <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 z-50 bg-linear-to-b from-gray-950 to-blue-950 border border-white/50 px-6 py-6 mt-2 rounded-lg">
          <div className="flex flex-col items-center gap-4">
            {/* ADD */}
            <AddTask />
            {/* VIEW */}
            <ViewTasks />
          </div>
        </div>
      </div>

    </nav>
  )
}