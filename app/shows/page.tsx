import { getFilteredShows } from "@/actions/showActions";
import { DeleteShow } from "@/components/delete_show";
import { ShowCard } from "@/components/show_card";
import { FaFilter} from "react-icons/fa6";
import { auth } from "@/auth";
import { SearchControlls } from "@/components/search_controlls";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import PaginationControll from "@/components/pagination";
import { getShowList } from "@/actions/userListActions";
export default async function Page(props: { searchParams: Promise<any> }) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search;
  const sort = searchParams.sort;
  const LIMIT = 10;
  const [session,list,result] = await Promise.all([auth(),getShowList(),getFilteredShows(page,LIMIT,search,sort)])
  const role = (session?.user as any)?.role || "VISITOR";
  const shows = result?.data;
  // add ui for no results
  return (
    <div className="relative min-h-[90vh] flex flex-col justify-between gap-4 py-6 px-4 ">
      <Sheet>
        <div className=" sticky  z-50 w-max ms-auto top-5 right-8  flex justify-end">
          <SheetTrigger className="">
            <FaFilter className="size-5 text-blue-500" />
          </SheetTrigger>
        </div>
        <SheetContent side="top" className="border border-red-500">
          <SheetTitle className="hidden">Search & Filter</SheetTitle>
          <SearchControlls type="shows"/>
        </SheetContent>
      </Sheet>
      {shows && shows.map((show) => (
        <div key={show.id} className="relative">
          <ShowCard show={show} role={role} list={list} />
          {role === "ADMIN" && <DeleteShow id={show.id} />}
        </div>
      ))}
      <section className="">
      <PaginationControll count={result?.total || 0} limit={LIMIT} />
    </section>
    </div>
  );
}
