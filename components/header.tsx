import { CircleUser, Menu, Package2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent,SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { signOut } from "@/auth"
import NavLinks from "./nav_links"
import NavLinksMobile from "./nav_links_mobile"
import { SearchBar } from "./search_bar"
import { auth } from "@/auth"
import Link from "next/link"

export default async function Header() {
    const session:any = await auth()
    const role = session?.user?.role || "VISITOR";
    return( 
        <header className="top-0 flex justify-between h-[70px] items-center  bg-transparent px-4 md:px-6">
          <div className="hidden md:block">
          <Link
            href="/"
            className="text-xl md:text-2xl italic text-white"
          >
            Fiction<span className="text-orange-500 text-3xl">Fusion</span>
          </Link>
          </div>

        <NavLinks role={role}/>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <SheetTitle className="sr-only">Open main menu</SheetTitle>
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[200px] bg-gradient-to-b from-gray-950 to-blue-950 ">
            <NavLinksMobile role={role}/>
          </SheetContent>
        </Sheet>
        <div className="flex  items-center gap-4  md:gap-2 lg:gap-4">
          <SearchBar/>
          {role === "VISITOR" ? 
        <Link href="/login" className="px-4 py-2   rounded-full bg-black/90 hover:bg-black text-white">Login</Link>:
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={"icon"}  className="rounded-full  bg-emerald-700 outline-none ring-transparent text-white">
                <CircleUser className="size-7" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem><a href="/profile">Profile</a></DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
              <form action={async () => {
                      "use server"
                      await signOut()
                    }}>
                      <Button type="submit">Logout</Button>
                    </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>  
        }
        </div>
      </header>
    )
}