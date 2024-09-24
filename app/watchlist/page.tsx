"use client"
import { getIgnoreList } from "@/actions/ignorelistActions";
import { getWatchlist } from "@/actions/watchlistActions";
import MyDramaShowCard from "@/components/mydramaShowCard";
import { useEffect, useState } from "react";

export default  function Page() {    
    const [data,setData] = useState(Array<any>())
    const [page,setPage] = useState(1)
    const getPageRange = (page: number): number[] => {
        const startPage = (page - 1) * 3 + 1;
        const endPage = startPage + 2;
        return Array.from({ length: 3 }, (_, i) => startPage + i); // [startPage, startPage+1, ..., endPage]
    };
    useEffect(
        () => {
            const fetcher = async () => {
                const pageRange = getPageRange(page)
                const promises = pageRange.map(pg =>
                    getWatchlist(`https://mydramalist.com/shows/top?page=${pg}`)
                );
                console.log("starting")
                const results = await Promise.all(promises);
                console.log(results)
                let mergedResults = results.flat();
                setData([...data, ...mergedResults])
            }
            fetcher()
        },[page]
    )


   
    return(
        <div className="w-full min-h-[90vh]">
        {data.length === 0 && <div className="w-full min-h-[90vh] flex justify-center items-center text-5xl text-white">Loading Please Wait...</div>}    

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-rows-4 gap-4 px-4 py-4">
        {data.map((item:any,index:number)=>(
            <MyDramaShowCard key={item.title} item={item}/>
        ))}
        </div>
            <div className="w-max mx-auto my-8"><button className="bg-green-600 text-white px-4 py-2 rounded-xl" onClick={()=>setPage((prev)=>prev+1)}>Load More</button></div>
        </div>
    )
}
