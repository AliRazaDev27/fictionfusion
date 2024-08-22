import { getAllShows, getFilteredShows, getPaginatedShows } from "@/actions/showActions";
import { DeleteShow } from "@/components/delete_show";
import { ShowCard } from "@/components/show_card";
import { Show } from "@/types";
import { FaFilter, FaTrashCan } from "react-icons/fa6";
import { auth } from "@/auth";
import { SearchControlls } from "@/components/search_controlls";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import PaginationControll from "@/components/pagination";
export default async function Page({ searchParams }: { searchParams: any }) {
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || "";
  const sort = searchParams.sort || "";
  const LIMIT = 10;
  const session: any = await auth();
  const role = session?.user?.role || "VISITOR";
  let result:{data:Show[],total:number}|null = {data:[],total:0};
  if(search !== "" || sort !== ""){
     result = await getFilteredShows(search,sort,page,LIMIT);
  }
  else{
     result = await getPaginatedShows(page, LIMIT);
  }
  const shows = result?.data;
  return (
    <div className="relative min-h-[90vh] flex flex-col justify-between gap-4 py-6 px-4 bg-gradient-to-b from-black/90 via-gray-800 to-gray-900">
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
          <ShowCard show={show} />
          {role === "ADMIN" && <DeleteShow id={show.id} />}
        </div>
      ))}
      <section className="">
      <PaginationControll count={result?.total || 0} limit={LIMIT} />
    </section>
    </div>
  );
}
