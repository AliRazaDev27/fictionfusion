"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CircleUser, Menu, Package2, Search } from "lucide-react"
import { cn } from "@/lib/utils"
export default function NavLinksMobile() {
    const pathname = usePathname()
    return (
        <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Acme Inc</span>
              </Link>
              <Link
                href="/dashboard"
                className={cn(`transition-colors hover:text-foreground`, pathname === "/dashboard" ? "text-foreground": "text-muted-foreground")}
              >
                Dashboard
              </Link>
              <Link
                href="/books"
                className={cn(`transition-colors hover:text-foreground`, pathname === "/books" ? "text-foreground": "text-muted-foreground")}
              >
                Books
              </Link>
              <Link
                href="/movies"
                className={cn(`transition-colors hover:text-foreground`, pathname === "/movies" ? "text-foreground": "text-muted-foreground")}
              >
                Movies
              </Link>
              <Link
                href="/shows"
                className={cn(`transition-colors hover:text-foreground`, pathname === "/shows" ? "text-foreground": "text-muted-foreground")}
              >
                Shows
              </Link>
              
            </nav>
    );
}