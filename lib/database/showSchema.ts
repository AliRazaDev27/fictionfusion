import { Book, } from "@/types";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { decimal, json, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import { stripHtml } from "../utils";

export const db = drizzle(sql);

export type Show = InferSelectModel<typeof ShowTable>;
export type NewShow = InferInsertModel<typeof ShowTable>;
let a:NewShow;
export const ShowTable = pgTable("shows", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 64 }).notNull(),
    type: varchar("type", { length: 10 }),
    language: varchar("language", { length: 64 }),
    genres: varchar("genres", { length: 16 }).array(),
    status: varchar("status", { length: 16 }),
    runtime: varchar("runtime", { length: 4 }),
    premiered: text("premiered"),
    ended: text("ended"),
    rating: decimal("rating", { precision: 3, scale: 1 }),
    image: json("image"),
    summary: text("summary"),
})

export const addShowTODatabase = async (show: any) => {
    const exists = await db.select({ id: ShowTable.id }).from(ShowTable).where(eq(ShowTable.name, show.name));
    if (exists.length > 0) {
        return { success: false, message: "Show already exists" }
    }
    show.type = show?.type || "N/A";
    show.language = show?.language || "N/A";
    show.premiered = show?.premiered || "N/A";
    show.ended = show?.ended || "N/A";
    show.summary = show?.summary ? stripHtml(show.summary) : "N/A";
    show.image = show?.image || {};
    show.genres = show?.genres || [];
    show.status = show?.status || "N/A";
    show.runtime = show?.runtime || "N/A";
    if(show?.rating && typeof show.rating !== "string"){
    show.rating = show?.rating?.average|| '0.0';
    }
    await db
        .insert(ShowTable)
        .values(show)
        ;
    return {
        success: true,
        message: "Show added successfully",
    }
}
export const getShows = async () => {
    const result = await db
        .select()
        .from(ShowTable)
        ;
    return result
}
export const deleteShow = async (id: number) => {
    try {
        await db
            .delete(ShowTable)
            .where(eq(ShowTable.id, id))
            ;
        return { success: true }
    }
    catch (err) {
        return { success: false, message: "Error deleting show" }
    }
}