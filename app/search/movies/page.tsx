import { getMovieByTitle } from "@/actions/movieActions";
import { AddMovieToDB } from "@/components/add_movie_to_db";
import { auth } from "@/auth";

import { MovieCard } from "@/components/movie_card";

export default async function Page({ searchParams }: { searchParams: any }) {
  const session: any = await auth();
  const role = session?.user?.role || "VISITOR";
  const result = await getMovieByTitle(searchParams.query);

  return (
    <div className="flex flex-col gap-4 py-4 px-4">
      {result.results.map((movie: any) => (
        <div className="relative" key={movie.id}>
            <MovieCard  movie={movie} role={role}/>
            {role === "ADMIN" && <AddMovieToDB movie={movie} />}
        </div>
      ))}
    </div>
  );
}

