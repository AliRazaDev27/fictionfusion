import { DeleteMovie } from "@/components/delete_movie";
import { Movie } from "@/types";
import { auth } from "@/auth";
import PaginationControll from "@/components/pagination";
import { getFilteredMovies, getPaginatedMovies } from "@/actions/movieActions";
import { MovieCard } from "@/components/movie_card";
import { SearchAndFilter } from "@/components/seach_filter_sheet";
import { Suspense } from "react";

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
        <SearchAndFilter type="movies" />
        <Suspense fallback={<p>Loading</p>}>
        {movies && movies.map((show) => (
          <div key={show.id} className="relative">
            <MovieCard movie={show} role={role}/>
            {role === "ADMIN" && <DeleteMovie id={show.id} />}
          </div>
        ))}
        </Suspense>
        <section>
        <Suspense fallback={null}>
        <PaginationControll count={result?.total || 0} limit={LIMIT} />
        </Suspense>
      </section>
      </div>
    )
}