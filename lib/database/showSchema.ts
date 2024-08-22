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
    const exists = await db.select({ id: ShowTable.id }).from(ShowTable).where(eq(ShowTable.name, show.name));
    if(exists.length > 0){
        return {success: false, message: "Show already exists"}
    }
    show.runtime = show.runtime || "N/A";
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