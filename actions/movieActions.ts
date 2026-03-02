"use server"
import { db } from "@/lib/database";
import { MovieTable } from "@/lib/database/movieSchema";
import { SortMovie } from "@/types";
import { count, eq,ilike,desc,asc, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

  const movieSortOption: SortMovie = {
    year_newest: desc(MovieTable.release_date),
    year_oldest: asc(MovieTable.release_date),
    rating_max: desc(MovieTable.vote_average),
    rating_min: asc(MovieTable.vote_average),
  };
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
      Authorization:`${process.env.TMDB_TOKEN}`,
    },
  });
  const result = await data.json();
  return result
}
export async function getPaginatedMovies(page: number, limit: number) {
    // maybe order them before returning
    try{
      console.log(page,limit)
      const result = await db.select().from(MovieTable).limit(limit).offset((page - 1) * limit);

    const total = await db.select({ count: count() }).from(MovieTable);
    return { data: result, total: total[0].count };
    }
    catch(err){
      // console.log(err);
      return null
    }
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
  export async function deleteMovieByID(id: number) {
    try{
      await db.delete(MovieTable).where(eq(MovieTable.id, id));
      revalidatePath("/movies")
      return {success: true}
    }
    catch(err){
      console.log(err)
      return {success: false, message: "Error deleting movie"}
    }
    
}
export async function getTotalMovies(){
  const result = await db.select({count:count()}).from(MovieTable)
  return result
} 
export async function getMoviesFromArrayList(list: number[]) {
  const result = await db
    .select()
    .from(MovieTable)
    .where(inArray(MovieTable.id, list));
  return result
}

export async function getPersonIdFromTMDBByTitle(title:string){
    const url = `https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(title)}&include_adult=true&language=en-US&page=1`
    const result = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `${process.env.TMDB_TOKEN}`,
      },
    });
    const response = await result.json();
    return response as {
      page: number;
      results: {
        adult: boolean;
        gender: number;
        id: number;
        known_for: {
          adult: boolean;
          backdrop_path: string;
          id: number;
          title: string;
          original_title: string;
          original_language: string;
          overview: string;
          poster_path: string;
          media_type: string;
          genre_ids: number[];
          popularity: number;
          release_date: string;
          video: boolean;
          vote_average: number;
          vote_count: number;
        }[];
        known_for_department: string;
        name: string;
        popularity: number;
        profile_path: string;
      }[];
      total_pages: number;
      total_results: number;
    }
}
17419

export async function getPersonWorksFromTMDBById(id:number){
  const url = `https://api.themoviedb.org/3/person/${id}/combined_credits?language=en-US`
  const result = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `${process.env.TMDB_TOKEN}`,
    },
  });
  const response = await result.json();
  return {
    cast: response.cast,
    id: response.id
  } as {
    cast:{
      adult:boolean;
      backdrop_path:string;
      genre_ids:number[];
      id:number;
      original_language:string;
      original_title:string;
      overview:string;
      popularity:number;
      poster_path:string;
      release_date:string;
      title:string;
      video:boolean;
      vote_average:number;
      vote_count:number;
      character:string;
      credit_id:string;
      order:number;
      media_type:string;
    }[];
    id:number;
  }
}
