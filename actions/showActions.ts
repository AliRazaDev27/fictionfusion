"use server"
import { addShowTODatabase, deleteShow, getShows } from "@/lib/database/showSchema";
import { NewShow,SortShow } from "@/types";
import { revalidatePath } from "next/cache";
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { ShowTable } from "@/lib/database/showSchema";
import { asc, count, desc, eq, ilike, inArray, like } from "drizzle-orm";
import { auth } from "@/auth";
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
export async function addShow(show: NewShow) {
  const session:any = await auth()
    if(session?.user?.role !== "ADMIN") return {success:false, message:"Not Authorized"}
    const result = await addShowTODatabase(show)
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
  page: number,
    limit: number,
    search?: string,
    sort?: string,
  ) => {
    const x = performance.now();    
    const selectResult = db.select().from(ShowTable);
    if (!!search) selectResult.where(ilike(ShowTable.name, `%${search}%`));
    if (!!sort) selectResult.orderBy(showSortOption[sort]);
    else{
      selectResult.orderBy(desc(ShowTable.rating));
    }
    selectResult.limit(limit).offset(limit * (page - 1));
    let totalCountQuery:any;
    if(!!search){
      totalCountQuery = db
      .select({ count: count() })
      .from(ShowTable)
      .where(ilike(ShowTable.name, `%${search}%`));
    } 
    else{
       totalCountQuery =  db.select({ count: count() }).from(ShowTable);
    }
    const [data, total] = await Promise.all([
      selectResult,
      totalCountQuery
    ])
    console.log("query time", performance.now() - x);
    return { data: data, total: total[0]?.count };
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
export async function getShowByID(id: number) {
    const result = await db
      .select()
      .from(ShowTable)
      .where(eq(ShowTable.id, id));
    return result[0];
} 
export async function updateShowRating(id: number, rating: string) {
    try{
      if(!(Number.isInteger(parseInt(rating)))) throw new Error("Rating must be an integer")
      if(parseInt(rating) < 0 || parseInt(rating) > 10) throw new Error("Rating must be between 0 and 10")
      const session:any = await auth()
    if(session?.user?.role !== "ADMIN") throw new Error("Not Authorized")
      await db
      .update(ShowTable)
      .set({ rating: rating })
      .where(eq(ShowTable.id, id));
      return {success:true} 
    }
    catch(err:any){
      console.log(err)
      return {success:false, message:err?.message}
    }
}
const showSortOption: SortShow = {
    year_newest: desc(ShowTable.premiered),
    year_oldest: asc(ShowTable.premiered),
    rating_max: desc(ShowTable.rating),
    rating_min: asc(ShowTable.rating),
  };