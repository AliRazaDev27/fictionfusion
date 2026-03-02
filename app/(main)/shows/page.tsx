import { getFilteredShows, getUniqueGenres } from "@/actions/showActions";
import { ShowsGrid } from "@/components/shows_grid";
import { FaFilter } from "react-icons/fa6";
import { FilterSidebar } from "@/components/filters/FilterSidebar";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
export default async function Page(props: { searchParams: Promise<any> }) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search;
  const sort = searchParams.sort;

  // New specific params
  const genres = searchParams.genres ? searchParams.genres.split(',') : undefined;
  const status = searchParams.status;
  const minRating = searchParams.minRating ? Number(searchParams.minRating) : undefined;

  const LIMIT = 36;
  const [result, uniqueGenres] = await Promise.all([
    getFilteredShows(page, LIMIT, search, sort, genres, status, minRating),
    getUniqueGenres()
  ]);

  const shows = result?.data;
  // add ui for no results
  return (
    <div className="relative min-h-[90vh] flex flex-col gap-6 py-6 px-4 md:px-8">
      <Sheet>
        <div className="flex justify-end sticky top-20 z-40 px-4 pointer-events-none">
          <SheetTrigger asChild>
            <button className="pointer-events-auto group flex items-center gap-2.5 px-5 py-2.5 bg-background/80 backdrop-blur-md border border-primary/20 hover:border-primary/50 text-foreground rounded-full shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5 transition-all duration-300">
              <div className="bg-primary/10 group-hover:bg-primary/20 p-1.5 rounded-full transition-colors">
                <FaFilter className="size-3.5 text-primary" />
              </div>
              <span className="text-sm font-bold tracking-tight">Filters</span>
            </button>
          </SheetTrigger>
        </div>
        <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
          <SheetTitle className="text-xl font-bold mb-4">Search & Filter</SheetTitle>
          <FilterSidebar genres={uniqueGenres as string[]} />
        </SheetContent>
      </Sheet>

      {shows && shows.length > 0 ? (
        <ShowsGrid
          initialShows={shows}
          initialTotal={result?.total || 0}
          search={search}
          sort={sort}
          genres={genres}
          status={status}
          minRating={minRating}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <p>No shows found.</p>
        </div>
      )}
    </div>
  );
}
