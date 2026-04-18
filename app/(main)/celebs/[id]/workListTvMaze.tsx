"use client"
import { getWorksByPersonIdFromTvMaze } from "@/lib/tvMaze";
import { useEffect, useState } from "react";

type Works = Awaited<ReturnType<typeof getWorksByPersonIdFromTvMaze>>;

export function WorksListTvMaze({ id }: { id: number }) {
  const [works, setWorks] = useState<Works | null>(null);

  useEffect(() => {
    async function fetchData() {
      const result = await getWorksByPersonIdFromTvMaze(id);
      setWorks(result);
    }
    fetchData();
  }, [id]);

  if (!works) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Shows x {works.length}</h1>
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {works.map((work) => (
            <div key={work._embedded.show.id} className="relative border rounded-lg p-2">
              <img
                src={work._embedded.show.image?.medium}
                alt={`${work._embedded.show.name} poster`}
                className="w-full h-92 rounded-md"
                loading="lazy"
              />
              <div>
              <h3 className="text-lg font-semibold mt-1">{work._embedded.show.name}</h3>
              <div className="flex items-center justify-between">
              <p className="text-sm text-gray-300">{work._links.character.name}</p>
              <p className="text-sm text-gray-300 capitalize">{work._embedded.show.type}</p>
              </div>
              <div className="flex items-center justify-between">
              <p className="text-sm text-gray-300">{work._embedded.show.premiered}</p>
              <p className="text-sm text-gray-300">{(work._embedded.show?.rating?.average)}</p>
              </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
