"use client"

import { getWatchlist } from "@/actions/watchlistActions";
import MyDramaShowCard from "@/components/mydramaShowCard";
import { ShowMyDramalist } from "@/types";
import { useEffect, useState, useRef } from "react";

export default  function Page() {    
    const [data,setData] = useState(Array<ShowMyDramalist>())
    const [page,setPage] = useState(1)
    const [isFetching, setIsFetching] = useState(false);
    const observerRef = useRef<IntersectionObserver | null>(null);
    useEffect(
        () => {
            const fetcher = async () => {
                setIsFetching(true);
                const result = await getWatchlist(`https://mydramalist.com/shows/top?page=${page}`)
                if(result.length === 0) setPage((prev) => prev + 1);
                setData([...data, ...result]);
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
        <div className="w-full" style={{minHeight:"calc(100vh - 70px)",overflowY:"auto"}}>
        {data.length === 0 && <div className="w-full text-center  text-5xl text-white">Loading Please Wait...</div>}    

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 px-4 py-4">
        {data.map((item)=>(
            <MyDramaShowCard key={item.title} item={item}/>
        ))}
        </div>
        <div id="scroll-anchor"  className="w-full h-1 bg-black"></div>
        </div>
    )
}
