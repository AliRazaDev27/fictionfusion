"use client"

import { getWatchlist } from "@/actions/watchlistActions";
import MyDramaShowCard from "@/components/mydramaShowCard";
import { useEffect, useState, useRef } from "react";

export default  function Page() {    
    const [data,setData] = useState(Array<any>())
    const [page,setPage] = useState(1)
    const [isFetching, setIsFetching] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);
    const getPageRange = (page: number): number[] => {
        const startPage = (page - 1) * 3 + 1;
        const endPage = startPage + 2;
        return Array.from({ length: 3 }, (_, i) => startPage + i); // [startPage, startPage+1, ..., endPage]
    };
    useEffect(
        () => {
            const fetcher = async () => {
                setIsFetching(true);
                const pageRange = getPageRange(page)
                const promises = pageRange.map(pg =>
                    getWatchlist(`https://mydramalist.com/shows/top?page=${pg}`)
                );
                const results = await Promise.all(promises);
                let mergedResults = results.flat();
                setData([...data, ...mergedResults]);
                setIsFetching(false);
            }
            fetcher()
        },[page]
    )
    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect(); // Cleanup previous observer

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isFetching) {
                    setPage((prev) => prev + 1);
                }
            },
            {
                rootMargin: "0px", // Load more when the user is 100px away from the bottom
            }
        );

        if (observerRef.current) observerRef.current = observer;
        const target = document.querySelector("#scroll-anchor");
        if (target) observer.observe(target);

        return () => observer.disconnect();
    }, [isFetching]);


   
    return(
        <div className="w-full min-h-[90vh]">
        {data.length === 0 && <div className="w-full text-center  text-5xl text-white">Loading Please Wait...</div>}    

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 px-4 py-4">
        {data.map((item:any,index:number)=>(
            <MyDramaShowCard key={item.title} item={item}/>
        ))}
        </div>
        <div id="scroll-anchor"  className="w-full h-1 bg-black"></div>
        </div>
    )
}
