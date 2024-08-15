import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { pgTable, serial, text,integer,varchar,char,decimal } from "drizzle-orm/pg-core";
import { Book } from "@/types";

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