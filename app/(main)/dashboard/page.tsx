"use client";
import { getTotalBooks } from "@/actions/bookActions";
import { getTotalMovies } from "@/actions/movieActions";
import { getTotalShows } from "@/actions/showActions";
import { getBookList, getMovieList, getShowList } from "@/actions/userListActions";
import { DashboardLayout } from "@/components/dashboard_layout";
import { useEffect, useState } from "react";

export default function Page() {
    const [list, setList] = useState([]);
    const [total, setTotal] = useState({});
    useEffect(() => {
        const fetchData = async () => {
            const [totalBooks, totalMovies, totalShows, bookList, movieList, showList] = await Promise.all(
                [getTotalBooks(), getTotalMovies(), getTotalShows(), getBookList(), getMovieList(), getShowList()]
            )
            const _list: any = []
            if (bookList) _list.push(...bookList)
            if (movieList) _list.push(...movieList)
            if (showList) _list.push(...showList)
            const _total = {
                totalBooks: totalBooks[0].count,
                totalMovies: totalMovies[0].count,
                totalShows: totalShows[0].count
            }
            setList(_list);
            setTotal(_total);
        }
        fetchData();
    }, [])
    return (
        <main className="text-white md:w-[95%] ms-auto py-8 px-4">
            <DashboardLayout total={total} list={list} />
        </main>
    )
}
