"use server";
import { Book, BookTable, NewBook } from "@/lib/database/bookSchema";
import { db } from "@/lib/database";
import { count } from "drizzle-orm";
import { cacheTag } from "next/cache";

export type bookSearchResult = {
  author_key: string[];
  author_name: string[];
  cover_edition_key: string;
  first_publish_year: number;
  first_sentence?: string | string[];
  key: string;
  number_of_pages_median: number;
  ratings_average: number;
  title: string;
}

export async function searchBookByTitle(title: string) {
  // const result = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(title)}&projection=full`);
  const result = await fetch(`https://openlibrary.org/search.json?q=${title}&fields=*&limit=10`)
  const response = await result.json()
  // console.log(response)
  return response.docs as bookSearchResult[];
}


export interface Details {
    covers: string[];
    description: string | { value: string } | undefined;
    subjects: string[];
}
export async function getBookWorkFromOL(key: string) {
  const result = await fetch(`https://openlibrary.org/${key}.json`)
  const response = await result.json()
  return response as Details;
}

export async function addBookToDB(book: NewBook) {
  try{
    await db.insert(BookTable).values(book);
    return {success:true, message: "Book added to DB successfully."};
  }catch (error) {
    console.error("Error adding book to DB:", error);
    return {success:false, message: "Failed to add book to DB."};
  }
}

export async function getBooks() {
  "use cache";
  cacheTag("actions-books-getbooks");
  try {
    const result = await db.select().from(BookTable);
    return { success: true, books: result };
  } catch (error) {
    console.error("Error fetching books:", error);
    return { success: false, message: "Failed to fetch books." };
  }
}

export async function getTotalBooks() {
    // return total number of books
    const result = await db.select({ count: count() }).from(BookTable);
    return result;
}