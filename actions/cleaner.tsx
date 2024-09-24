"use server";
import { getOpenLibraryCoverLink } from "@/lib";
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { eq } from "drizzle-orm";
import { BookTable } from "@/lib/database/bookSchema";

const db = drizzle(sql);

export async function removeEmptyImages(bookID: number, olid: string[] | null) {
  try {
    if (!olid || olid.length === 0) return;
    const updatedOlid: string[] = [];
    for(let i = 0; i < olid.length; i++){
      const id = olid[i];
      if(updatedOlid.length >= 20) break;
      try {
          const url = getOpenLibraryCoverLink("olid", id, "M")
          const source = await fetch(url, { method: "HEAD" });
          if (source.status === 200) {
            console.log("added ", i+1);
            updatedOlid.push(id);
          }
        } catch (error:any) {
          console.log("Error fetching URL:", id, error);
        }
      }
      console.log("updating book ", bookID);
      const result = await db
      .update(BookTable)
      .set({ olid: updatedOlid })
      .where(eq(BookTable.id, bookID));
      return {
      success: true};
    }
  catch (err:any) {
    console.log(err);
  }
}
  

export async function clean() {
console.log("cleaning")
  try {
    const allBooks = await db
      .select({ id: BookTable.id, olid: BookTable.olid })
      .from(BookTable);
    console.log("books found ", allBooks.length);
    for (let i = 0; i < allBooks.length; i++) {
      await removeEmptyImages(allBooks[i].id, allBooks[i].olid);
      console.log("updated ", i + 1);
    }
  } catch (err) {
    console.log(err);
  }
}
