import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { pgTable, serial, text,integer,varchar,char,decimal } from "drizzle-orm/pg-core";

export const db = drizzle(sql);

export const BookTable = pgTable(
    "books",
    {
        title: varchar("title",{length:255}).notNull(),
        author: varchar("author",{length:255}).notNull(),
        cover_edition_key: char("cover_edition_key",{length:11}).notNull(),
        first_publish_year: char("first_publish_year",{length:4}).notNull(),
        first_sentence: text("first_sentence"),
        isbn: varchar("isbn",{length:64}).notNull().array(),
        number_of_pages: integer("number_of_pages"),
        rating: decimal("rating"),
    }    
)
export const getBookTable = async () => {
    const selectResult = await db.select().from(BookTable).limit(10);
    return selectResult
}