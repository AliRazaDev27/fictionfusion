"use server"
import { db } from "@/lib/database";
import { MovieTable } from "@/lib/database/movieSchema";
import { SortMovie } from "@/types";
import { count, eq,ilike,desc,asc } from "drizzle-orm";

export async function addMovieToDB(movie: any) {
    const exists = await db.select({ id: MovieTable.id }).from(MovieTable).where(eq(MovieTable.title, movie.title));
    if(exists.length > 0){
        return {success: false, message: "Movie already exists"}
    }
    movie.id = undefined
    await db
        .insert(MovieTable)
        .values(movie)
        ;
    return {success: true}
}
export async function getMovieByTitle(title: string) {
    const url = `https://api.themoviedb.org/3/search/movie?query=${title}&include_adult=true&language=en-US&page=1`;
  const data = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5OWI4NThhODE2MTY3OTIzZDYzM2RiNDk4YjQ0YzA2YyIsIm5iZiI6MTcyNDQ3NDA5MS4xMjQ4NTEsInN1YiI6IjY2Yzk2MTcwNTJiMTlhYWU0OGE3MDFlOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.cj714SINutl545l4BOT3xbUTDRMXvMX6ruX0_KVWU94",
    },
  });
  const result = await data.json();
  return result
}
export async function getPaginatedMovies(page: number, limit: number) {
    // maybe order them before returning
    const result = await db.select().from(MovieTable).limit(limit).offset((page - 1) * limit);
    const total = await db.select({ count: count() }).from(MovieTable);
    return { data: result, total: total[0].count };
}
export const getFilteredMovies = async (
    search: string,
    sort: string,
    page: number,
    limit: number
  ) => {
    console.log("calling");
    if (search === "" && sort === "") {
      console.log("returning null");
      return null;
    }
    const selectResult = db.select().from(MovieTable);
    if (search !== "") {
      selectResult.where(ilike(MovieTable.title, `%${search}%`));
    }
    if (sort !== "") {
      selectResult.orderBy(movieSortOption[sort]);
    }
    selectResult.limit(limit).offset(limit * (page - 1));
    const data = await selectResult;
    const total = await db
      .select({ count: count() })
      .from(MovieTable)
      .where(ilike(MovieTable.title, `%${search}%`));
    return { data: data, total: total[0].count };
  };
  const movieSortOption: SortMovie = {
    year_newest: desc(MovieTable.release_date),
    year_oldest: asc(MovieTable.release_date),
    rating_max: desc(MovieTable.vote_average),
    rating_min: asc(MovieTable.vote_average),
  };