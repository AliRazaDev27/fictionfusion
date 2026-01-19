import { getFilteredShows } from "@/actions/showActions";
import { ShowsGrid } from "@/components/shows_grid";
import { FaFilter } from "react-icons/fa6";
import { SearchControls } from "@/components/search_controls";
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
  const LIMIT = 36;
  const result = await getFilteredShows(page, LIMIT, search, sort)
  const shows = result?.data;
  // add ui for no results
  return (
    <div className="relative min-h-[90vh] flex flex-col gap-6 py-6 px-4 md:px-8">
      <Sheet>
        <div className="flex justify-end sticky top-5 z-50">
          <SheetTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all">
              <FaFilter className="size-4" />
              <span className="text-sm font-semibold">Filters</span>
            </button>
          </SheetTrigger>
        </div>
        <SheetContent side="top" className="w-full">
          <SheetTitle className="hidden">Search & Filter</SheetTitle>
          <SearchControls type="shows" />
        </SheetContent>
      </Sheet>

      {shows && shows.length > 0 ? (
        <ShowsGrid
          initialShows={shows}
          initialTotal={result?.total || 0}
          search={search}
          sort={sort}
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <p>No shows found.</p>
        </div>
      )}
    </div>
  );
}
