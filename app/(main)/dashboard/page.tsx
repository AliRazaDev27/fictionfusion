import { getTotalBooks } from "@/actions/bookActions";
import { getTotalMovies } from "@/actions/movieActions";
import { getTotalShows } from "@/actions/showActions";
import { getBookList, getMovieList, getShowList } from "@/actions/userListActions";
import { DashboardLayout } from "@/components/dashboard_layout";

export default async function Page() {
    const [totalBooks, totalMovies, totalShows, bookList, movieList, showList] = await Promise.all([
        getTotalBooks(),
        getTotalMovies(),
        getTotalShows(),
        getBookList(),
        getMovieList(),
        getShowList()
    ]);

    const list: any[] = [];
    if (bookList) list.push(...bookList);
    if (movieList) list.push(...movieList);
    if (showList) list.push(...showList);

    const total = {
        totalBooks: totalBooks[0].count,
        totalMovies: totalMovies[0].count,
        totalShows: totalShows[0].count
    };

    return (
        <main className="text-white md:w-[95%] ms-auto py-8 px-4">
            <DashboardLayout total={total} list={list} />
        </main>
    );
}
