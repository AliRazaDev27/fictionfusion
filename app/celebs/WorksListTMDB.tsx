"use client"
import { getPersonWorksFromTMDBById } from "@/actions/movieActions";
import { useEffect, useState } from "react";

type Works = Awaited<ReturnType<typeof getPersonWorksFromTMDBById>>;

export function WorksListTMDB({ id }: { id: number }) {
  const [works, setWorks] = useState<Works | null>(null);
  console.log(works?.cast.length)

  useEffect(() => {
    async function fetchData() {
      const result = await getPersonWorksFromTMDBById(id);
      const filteredWorks = new Array();
      for(let work of result.cast){
        if(work.order>=0 && work.order<=5){
        console.log(work)
        //CAUTION: this also filters out upcoming works.
        if(work.poster_path){
          filteredWorks.push(work)
        }
        }
      }
      setWorks({
        cast: filteredWorks,
        id: result.id
      });
    }
    fetchData();
  }, [id]);

  if (!works) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Works x {works.cast.length}</h1>
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {works.cast.map((work) => (
            <div key={work.credit_id} className="relative border rounded-lg p-2">
              <img
                src={`https://image.tmdb.org/t/p/w500${work.poster_path}`}
                alt={work.title}
                className="w-full h-92 rounded-md"
                loading="lazy"
              />
              <div>
              <h3 className="text-lg font-semibold mt-1">{work.title}</h3>
              <div className="flex items-center justify-between">
              <p className="text-sm text-gray-300">{work.character}</p>
              <p className="text-sm text-gray-300 capitalize">{work.media_type}</p>
              </div>
              <div className="flex items-center justify-between">
              <p className="text-sm text-gray-300">{work.release_date}</p>
              <p className="text-sm text-gray-300">{(work.vote_average/2).toFixed(1)}</p>
              </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
