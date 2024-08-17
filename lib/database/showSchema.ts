import { Book, } from "@/types";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { json, pgTable, serial,text,varchar } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";

export const db = drizzle(sql);

export type Show = InferSelectModel<typeof ShowTable>;
export type NewShow = InferInsertModel<typeof ShowTable>;

export const ShowTable = pgTable("shows", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 64 }).notNull(),
    type: varchar("type",{length: 10}).notNull(),
    language: varchar("language",{length: 64}).notNull(),
    genres: varchar("genres",{length: 16}).notNull().array(),
    status: varchar("status",{length:16}).notNull(),
    runtime: varchar("runtime",{length:4}).notNull(),
    premiered: text("premiered").notNull(),
    ended: text("ended").notNull(),
    rating: json("rating"),
    image: json("image").notNull(),
    summary: text("summary").notNull(),
})

export const addShowTODatabase = async (show: Show) => {
    await db
        .insert(ShowTable)
        .values(show)
        ;
    return {
        success: true}
}
export const getShows = async () => {
    const result = await db
        .select()
        .from(ShowTable)
        ;
    return result
}
export const deleteShow = async (id: number) => {
  await db
        .delete(ShowTable)
        .where(eq(ShowTable.id, id))
        ;
    return {success: true}
}