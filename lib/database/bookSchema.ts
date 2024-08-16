import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { pgTable, serial, text,integer,varchar,char,decimal } from "drizzle-orm/pg-core";
import { Book, SortBook } from "@/types";
import { asc, count, desc, eq, ilike, like } from "drizzle-orm";

export const db = drizzle(sql);

export const BookTable = pgTable(
    "books",
    {
        id: serial("id").primaryKey(),
        title: varchar("title",{length:255}).notNull(),
        author_name: varchar("author_name",{length:255}).notNull(),
        author_id: varchar("author_id",{length:20}).notNull(),
        cover_edition_key: char("cover_edition_key",{length:11}).notNull(),
        first_publish_year: char("first_publish_year",{length:4}).notNull(),
        first_sentence: text("first_sentence"),
        olid: varchar("olid",{length:20}).notNull().array(),
        number_of_pages: integer("number_of_pages"),
        rating: decimal("rating"),
    }    
)

export const addBook = async (book:Book) => {
    const insertResult = await db
    .insert(BookTable)
    .values(book)
    .returning();
    return insertResult
    
}

export const getBookTable = async () => {
    const selectResult = await db.select().from(BookTable).limit(10);
    return selectResult
}
export const getBook = async () => {
    const selectResult = await db.select().from(BookTable).limit(1);
    return selectResult
}
export const getPaginatedBooks = async (limit:number,offset:number) => {
    const selectResult = await db.select().from(BookTable).limit(limit).offset(offset);
    const total = await db.select({count:count()}).from(BookTable)
    return {data:selectResult,total:total[0].count}
}
export const getFilteredBooks = async (search:string,sort:string,page:number,limit:number) => {
    console.log("calling")
    if(search==="" && sort===""){
        console.log("returning null")
        return null
    }
    const selectResult = db.select().from(BookTable)
    if(search !==""){
        selectResult.where(ilike(BookTable.title, `%${search}%`))
    }
    if(sort !==""){
        selectResult.orderBy(bookSortOption[sort])
    }
    selectResult.limit(limit).offset(limit*(page-1))
    const data = await selectResult
    const total = await db.select({count:count()}).from(BookTable).where(ilike(BookTable.title, `%${search}%`))
    return {data:data,total:total[0].count}
}
export const deleteImageFromOlid = async (value:string,id:number) => {
  try{
    const book = await db.select({olid:BookTable.olid}).from(BookTable).where(eq(BookTable.id, id)).limit(1)
    const olid = book[0].olid
    if(olid === null) return
    let updatedOlid = olid.filter((item:string) => item !== value)
    await db
    .update(BookTable)
    .set({olid:updatedOlid})
    .where(eq(BookTable.id, id))
    return {success:true}
}
  catch(err){
    console.log(err)
    return {success:false,message:err.message}
  }
}

export const setCoverImage = async (value:string,id:number) => {
   try{
    await db
    .update(BookTable)
    .set({cover_edition_key:value})
    .where(eq(BookTable.id, id))
    return {success:true}
   }
   catch(err){
    console.log(err)
    return {success:false,message:err.message}
   }
    
}




export const bookSortOption:SortBook = {
    year_newest:desc(BookTable.first_publish_year),
    year_oldest: asc(BookTable.first_publish_year),
    rating_max: desc(BookTable.rating),
    rating_min: asc(BookTable.rating),
    pages_max: desc(BookTable.number_of_pages),
    pages_min: asc(BookTable.number_of_pages)
}