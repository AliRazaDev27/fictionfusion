"use server"
import { addShowTODatabase, deleteShow, getShows } from "@/lib/database/showSchema";
import { Show, SortShow } from "@/types";
import { revalidatePath } from "next/cache";
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { ShowTable } from "@/lib/database/showSchema";
import { asc, count, desc, eq, ilike, inArray, like } from "drizzle-orm";
const db = drizzle(sql);


export async function getShowInfo(showID: string) {
    // https://api.tvmaze.com/shows/:id
    const result = await fetch(`https://api.tvmaze.com/shows/${showID}`);
    const response = await result.json();
    return response;
}
export async function searchShowByTitle(title: string) {
    // https://api.tvmaze.com/search/shows?q=:title
    const result = await fetch(`https://api.tvmaze.com/search/shows?q=${title}`);
    const response = await result.json();
    return response;
}
export async function addShow(show: Show) {
    const result = await addShowTODatabase(show);
    if(result.success){
        revalidatePath("/shows")
    }
    return result
}
export async function getAllShows() {
    const result = await getShows();
    return result
}
export async function deleteShowByID(id: number) {
    const result = await deleteShow(id);
    if(result.success){
        revalidatePath("/shows")
    }
    return result
}
export async function getShowGallery(id: number) {
    const result = await fetch(`https://api.tvmaze.com/shows/${id}/images`);
    const response = await result.json();
    return response;
}
export async function getPaginatedShows(page: number, limit: number) {
    const result = await db.select().from(ShowTable).limit(limit).offset((page - 1) * limit);
    const total = await db.select({ count: count() }).from(ShowTable);
    return { data: result, total: total[0].count };
}
export const getFilteredShows = async (
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
    const selectResult = db.select().from(ShowTable);
    if (search !== "") {
      selectResult.where(ilike(ShowTable.name, `%${search}%`));
    }
    if (sort !== "") {
      selectResult.orderBy(showSortOption[sort]);
    }
    selectResult.limit(limit).offset(limit * (page - 1));
    const data = await selectResult;
    const total = await db
      .select({ count: count() })
      .from(ShowTable)
      .where(ilike(ShowTable.name, `%${search}%`));
    return { data: data, total: total[0].count };
  };
  export async function getTotalShows(){
    const result = await db.select({count:count()}).from(ShowTable)
    return result
  } 
  export async function getShowsFromArrayList(list: number[]) {
    const result = await db
      .select()
      .from(ShowTable)
      .where(inArray(ShowTable.id, list));
    return result
  }

const showSortOption: SortShow = {
    year_newest: desc(ShowTable.premiered),
    year_oldest: asc(ShowTable.premiered),
    rating_max: desc(ShowTable.rating),
    rating_min: asc(ShowTable.rating),
  };