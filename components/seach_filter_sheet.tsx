import {Sheet, SheetContent, SheetTitle, SheetTrigger} from "@/components/ui/sheet"
import { FaFilter } from "react-icons/fa";
import { SearchControlls } from "@/components/search_controlls";
export default function SearchAndFilter({ type }: { type: string }) {
    return (
        <Sheet>
          <div className=" sticky  z-50 w-max ms-auto top-5 right-8  flex justify-end">
            <SheetTrigger className="">
              <FaFilter className="size-5 text-blue-500" />
            </SheetTrigger>
          </div>
          <SheetContent side="top" className="border border-red-500">
            <SheetTitle className="hidden">Search & Filter</SheetTitle>
            <SearchControlls type={type}/>
          </SheetContent>
        </Sheet>
    )
}