import { Movie } from "@/types";
import { getMoviePosterLink } from "@/lib";
import { getGenre } from "@/lib/utils";
import Image from "next/image";
import { AddToList } from "./add_to_list";
export function MovieCard({ movie,role,list}: { movie: Movie,role:string,list?:any }) {
  
    return (
      <div
        key={movie.id}
        className="grid grid-cols-1 md:grid-cols-6  mx-2 gap-2    text-white"
      >
        <div className="col-span-1 relative overflow-hidden aspect-[2/3] rounded-3xl">
          <Image
          src={getMoviePosterLink(movie.poster_path, "w342")}
          alt="poster"
          placeholder="blur"
          className="transition-all duration-1000"
          blurDataURL="/placeholder.svg"
          unoptimized
          fill
          style={{ objectFit: "cover" }} 
          />
        </div>
        <div className="col-span-1 py-2 sm:col-span-4 md:col-span-5 flex flex-col justify-between px-4 bg-gray-900 rounded-2xl border border-gray-800">
          <h2 className="text-lg md:text-2xl">{movie.title}</h2>
          <ul className="flex gap-2">
            {movie.genre_ids && movie.genre_ids.map((genre: any) => (
              <li key={genre}>{getGenre(genre)}</li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-4">
            <p>Release Date: <span>{movie.release_date}</span></p>
            <p>Language: <span className="border border-green-800 bg-green-900 rounded-full px-3 py-1">{movie.original_language}</span></p>
          </div>
          <div className="flex flex-wrap gap-4">
            <p>Average Rating: <span>{movie.vote_average}</span></p>
            <p>No. of Votes: <span>{movie.vote_count}</span></p>
            <p>Popularity: <span>{movie.popularity}</span></p>
          </div>
          <p>{movie.overview}</p>
          {role !== "VISITOR" && <AddToList list={list} item={movie.id} />}
        </div>
      </div>
    );
  }