import Link from "next/link"
import {
  Home,
} from "lucide-react"
import { FaBookOpen } from "react-icons/fa";
import { BiSolidMoviePlay } from "react-icons/bi";
import { ImTv } from "react-icons/im";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip"
export default function Layout({ children }: { children: React.ReactNode }) {
    return(
        <div className="min-h-screen w-full border border-blue-500">
        <TooltipProvider>
        <aside className="md:fixed  h-max w-max mx-auto mt-2  md:left-2 md:top-1/2 md:-translate-y-1/2 z-10  border border-red-500 bg-sky-950 rounded-2xl">
        <nav className="flex flex-row md:flex-col items-center gap-4 px-2 py-2">
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80 transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Home className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Dashboard</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/books"
                className="flex h-9 w-9 items-center justify-center rounded-lg  text-white/80 transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <FaBookOpen className="h-5 w-5" />
                <span className="sr-only">Books</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Books</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/movies"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80 transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <BiSolidMoviePlay className="h-5 w-5" />
                <span className="sr-only">Movies</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Movies</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dashboard/shows"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80 transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <ImTv className="h-5 w-5" />
                <span className="sr-only">Shows</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Shows</TooltipContent>
          </Tooltip>
          
        </nav>
        
      </aside>
      </TooltipProvider>
      {children}
    </div>
    )
}