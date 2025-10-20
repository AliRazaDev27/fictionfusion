"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { SheetClose } from "./ui/sheet"

const links = [
  {
    href: "/music",
    label: "Music",
  },
  {
    href: "/watchlist",
    label: "Watchlist",
  },
  {
    href: "/celebs",
    label: "Celebs",
  },
  {
    href: "/books",
    label: "Books",
  },
  {
    href: "/movies",
    label: "Movies",
  },
  {
    href: "/shows",
    label: "Shows",
  },
  {
    href: "/chat",
    label: "Chat",
  },
  {
    href: "/quiz",
    label: "Quiz",
  }
]

export default function NavLinksMobile() {
  const pathname = usePathname()
  return (
    <nav className="flex flex-col justify-center text-center gap-6 text-lg font-medium">
      <SheetClose asChild>
      <Link
        href="/"
        prefetch={false}
        className="text-lg font-semibold text-white"
      >
        Fiction
        <span className="text-orange-500 text-xl">Fusion</span>
      </Link>
      </SheetClose>
      {
        links.map((link,index) => {
          return (
            <SheetClose asChild key={index}>
            <Link
              href={link.href}
              prefetch={false}
              className={cn(`transition-colors duration-100 hover:text-orange-500`, pathname === '/chat' ? "text-white font-semibold" : "text-white/60")}>
              {link.label}
            </Link>
            </SheetClose>
          )
        })
      }
    </nav>
  );
}