import { db } from "./index";
import { integer, pgTable,serial,varchar } from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const ListTable = pgTable("lists", {
    id: serial("id").primaryKey(),
    listName: varchar("listname", { length: 255 }).notNull(),
    creator: varchar("creator", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 }).notNull(),
    items:integer("items").array(),
})
export type NewList = InferInsertModel<typeof ListTable>;
export type List = InferSelectModel<typeof ListTable>;
