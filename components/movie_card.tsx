import { Movie } from "@/types";
import { getMoviePosterLink } from "@/lib";
import { getGenre } from "@/lib/utils";
export function MovieCard({ movie }: { movie: Movie }) {
    return (
      <div
        key={movie.id}
        className="grid grid-cols-1 md:grid-cols-6  mx-2    text-white"
      >
        <div className="w-max col-span-1 border border-gray-700 rounded-lg overflow-hidden">
          <img src={getMoviePosterLink(movie.poster_path, "w185")} alt="poster" className="w-[185px]" />
        </div>
        <div className="col-span-1 pt-2 md:col-span-5 space-y-2 ps-4 bg-gray-900 rounded-2xl border border-gray-800">
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
        </div>
      </div>
    );
  }