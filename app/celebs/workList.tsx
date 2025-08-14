"use client"
import { addWorkInIgnoredList } from "@/actions/celebActions";
import { Button } from "@/components/ui/button";
import { FilmData } from "@/lib";
import Link from "next/link";
import { useEffect, useState } from "react";
// const sample = ["Nirvana in Fire","The Disguiser","Sound of the Desert","You Are the Best","Refresh 3+7"]
export function WorkList({id,workInfo,ignoredTitles}:{id:number,workInfo:FilmData,ignoredTitles:string[]}){
  const [list, setList] = useState(workInfo);
  
  const markDone = async(category,title) => {
    const result = await addWorkInIgnoredList(id,title);
    if(!result) return
    setList((prevList) => {
      const updatedList = { ...prevList };
      if (updatedList[category]) {
        updatedList[category] = updatedList[category].filter((film) => film.title !== title);
      }
      return updatedList;
    });
  }
  useEffect(() => {
    const updatedList = { ...list };
    for (const category in updatedList) {
      updatedList[category] = updatedList[category].filter((film) => !ignoredTitles.includes(film.title));
    }
    setList(updatedList);
  },[])
  return(
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
                    <Button
                    className="cursor-pointer hover:bg-green-600"
                    onClick={() => markDone(category,film.title)}>MARK</Button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
  )
}