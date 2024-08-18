"use server"
import { getOpenLibraryCoverLink } from "@/lib";
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { eq } from "drizzle-orm";
import { BookTable } from "@/lib/database/bookSchema";
const db = drizzle(sql);
export async function removeEmptyImages(bookID:number,olid:string[]|null) {
    if(!olid || olid.length === 0) return
    const fetchPromises = olid.map(async(id,i)=>{
        const source = await fetch(getOpenLibraryCoverLink("olid",id,"M"),{method:"HEAD"})
      if(source.status === 200){
        console.log("added ",i+1)
        return id
      }
      return null
    })
    const fetcher = await Promise.all(fetchPromises)
    const updatedOlid = fetcher.filter((item)=>item !== null)
    const result = await db.update(BookTable).set({olid:updatedOlid}).where(eq(BookTable.id,bookID))
    return
}