import { getAllShows, getFilteredShows, getPaginatedShows } from "@/actions/showActions";
import { DeleteShow } from "@/components/delete_show";
import { ShowCard } from "@/components/show_card";
import { Movie, Show } from "@/types";
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
import { getFilteredMovies, getPaginatedMovies } from "@/actions/movieActions";
import { MovieCard } from "@/components/movie_card";
export default async function Page({ searchParams }: { searchParams: any }) {
    const page = Number(searchParams.page) || 1;
  const search = searchParams.search || "";
  const sort = searchParams.sort || "";
  const LIMIT = 10;
  const session: any = await auth();
  const role = session?.user?.role || "VISITOR";
  let result:{data:Movie[],total:number}|null = {data:[],total:0};
  if(search !== "" || sort !== ""){
     result = await getFilteredMovies(search,sort,page,LIMIT);
  }
  else{
     result = await getPaginatedMovies(page, LIMIT);
  }
  const movies = result?.data;
    return(
        <div className="relative min-h-[90vh] flex flex-col justify-between gap-4 py-6 px-4 ">
        <Sheet>
          <div className=" sticky  z-50 w-max ms-auto top-5 right-8  flex justify-end">
            <SheetTrigger className="">
              <FaFilter className="size-5 text-blue-500" />
            </SheetTrigger>
          </div>
          <SheetContent side="top" className="border border-red-500">
            <SheetTitle className="hidden">Search & Filter</SheetTitle>
            <SearchControlls type="movies"/>
          </SheetContent>
        </Sheet>
        {movies && movies.map((show) => (
          <div key={show.id} className="relative">
            <MovieCard movie={show} />
            {role === "ADMIN" && <DeleteShow id={show.id} />}
          </div>
        ))}
        <section className="">
        <PaginationControll count={result?.total || 0} limit={LIMIT} />
      </section>
      </div>

    )
}