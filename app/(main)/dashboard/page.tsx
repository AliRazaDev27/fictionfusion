"use client";
import { getTotalBooks } from "@/actions/bookActions";
import { getTotalMovies } from "@/actions/movieActions";
import { getTotalShows } from "@/actions/showActions";
import { getBookList, getMovieList, getShowList } from "@/actions/userListActions";
import { DashboardLayout } from "@/components/dashboard_layout";
import { useState, useEffect } from "react";
export default function Page() {
    const [total, setTotal] = useState({
        totalBooks: 0,
        totalMovies: 0,
        totalShows: 0
    });
    const [list, setList] = useState<any[]>([]);

    useEffect(() => {
        const load = async () => {
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
            setTotal(total);
            setList(list);
        }
        load();
    }, [])

    return (
        <main className="text-white md:w-[95%] ms-auto py-8 px-4">
            <DashboardLayout total={total} list={list} />
        </main>
    );
}
