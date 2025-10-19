"use client"
import { addWorkInFavouritedList, addWorkInIgnoredList } from "@/actions/celebActions";
import { Button } from "@/components/ui/button";
import { FilmData } from "@/lib";
import Link from "next/link";
import { useEffect, useState } from "react";
// const sample = ["Nirvana in Fire","The Disguiser","Sound of the Desert","You Are the Best","Refresh 3+7"]
export function WorkList({ id, workInfo, ignoredTitles,favouritedTitles,extraInfo }:
  { id: number,
    workInfo: FilmData, 
    ignoredTitles: string[],
    favouritedTitles: string[],
    extraInfo:{
      title:string,
      avatar:string,
      nationality:string,
      gender:string,
      age:string
    }
   }) {
  const [list, setList] = useState(workInfo);

  const handleIgnore = async (category, title) => {
    const result = await addWorkInIgnoredList(id, title);
    if (!result) return
    setList((prevList) => {
      const updatedList = { ...prevList };
      if (updatedList[category]) {
        updatedList[category] = updatedList[category].filter((film) => film.title !== title);
      }
      return updatedList;
    });
  }

  const handleFavourite = async (category, title) => {
    const result = await addWorkInFavouritedList(id, title);
    if (!result) return
    // maybe add a heart?
  }
  const filterAll = ()=>{
      setList(workInfo);
    }
    const filterWatchlist = ()=>{
      console.log(list)
    const updatedList = { ...workInfo };
    for (const category in updatedList) {
      updatedList[category] = updatedList[category].filter((film) => !ignoredTitles.includes(film.title));
    }
    setList(updatedList);
    }
    const filterFavourites = ()=>{
      const updatedList = { ...workInfo };
      for (const category in updatedList) {
        updatedList[category] = updatedList[category].filter((film) => favouritedTitles.includes(film.title));
      }
      setList(updatedList);
    }
  useEffect(() => {
    filterWatchlist();
  }, [])
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4 sm:gap-8">
        <img src={extraInfo.avatar || ""} alt={extraInfo.title} className="w-32 h-32 rounded-xl mb-4" />
        <div>
          <h1 className="text-3xl font-bold">{extraInfo.title}</h1>
          <p>{extraInfo.nationality}</p><p>{extraInfo.gender}</p><p>{extraInfo.age}</p>
        </div>
        <div className="flex flex-col gap-4">
          <button className="p-2 bg-teal-600 rounded-lg" onClick={filterWatchlist}>Watchlist</button>
          <button className="p-2 bg-teal-600 rounded-lg" onClick={filterFavourites}>Favourites</button>
          <button className="p-2 bg-teal-600 rounded-lg" onClick={filterAll}>All</button>
        </div>
      </div>
      <div className="space-y-8">
        {Object.keys(list).map((category) => (
          <div key={category}>
            <h2 className="text-2xl font-semibold border-b-2 border-gray-700 pb-2 mb-4">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {list[category].map((film, index) => (
                <div key={index} className="flex flex-col gap-2 bg-gray-800 p-4 rounded-lg shadow-lg">
                  <Link href={`https://mydramalist.com/${film.link}` || ""} target="_blank" prefetch={false} className="text-xl font-bold">{film.title}</Link>
                  <p className="text-gray-400">{film.year}</p>
                  <p>Role: {film.role}</p>
                  <p>Episodes: {film.episodes}</p>
                  <div className="flex items-center justify-between">
                    <p>Rating:
                      {film.rating === "0.0" ? " N/A" :
                        <span className="ms-2 inline-block font-semibold bg-yellow-500 text-black rounded-full px-3 py-3">{film.rating}</span>
                      }
                    </p>
                    <div className="flex items-center gap-2">
                    <Button
                      className="cursor-pointer hover:bg-green-600"
                      onClick={() => handleFavourite(category, film.title)}>Favourite</Button>
                    <Button
                      className="cursor-pointer hover:bg-green-600"
                      onClick={() => handleIgnore(category, film.title)}>Ignore</Button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}