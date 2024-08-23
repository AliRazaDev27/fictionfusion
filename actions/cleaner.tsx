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
    const batchSize = 500;
    const updatedOlid: string[] = [];
    const processBatch = async (batch: string[]) => {
      const fetchPromises = batch.map(async (id, i) => {
        try {
          const source = await fetch(getOpenLibraryCoverLink("olid", id, "M"), {
            method: "HEAD",
          });
          if (source.status === 200) {
            console.log("added ", i + 1);
            return id;
          }
        } catch (error) {
          console.log("Error fetching URL:", id, error);
        }
        return null;
      });

      const fetcher = await Promise.all(fetchPromises);
      return fetcher.filter((item) => item !== null);
    };

    for (let i = 0; i < olid.length; i += batchSize) {
      const batch = olid.slice(i, i + batchSize);
      const batchResult = await processBatch(batch);
      updatedOlid.push(...batchResult);
    }

    const result = await db
      .update(BookTable)
      .set({ olid: updatedOlid })
      .where(eq(BookTable.id, bookID));
    return {
      success: true};
  } catch (err) {
    console.log(err);
  }
}
export async function clean() {
  console.log("cleaning");
  try {
    const allBooks = await db
      .select({ id: BookTable.id, olid: BookTable.olid })
      .from(BookTable);
    console.log("got all books");
    for (const book of allBooks) {
      await removeEmptyImages(book.id, book.olid);
      console.log("updated ", book.id);
    }
  } catch (err) {
    console.log(err);
  }
}
