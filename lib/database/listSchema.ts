import { integer, pgTable,serial,timestamp,varchar } from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const ListTable = pgTable("lists", {
    id: serial("id").primaryKey(),
    listName: varchar("listname", { length: 255 }).unique().notNull(),
    creator: varchar("creator", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 }).notNull(),
    items:integer("items").array().default([]),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdateFn(() => new Date()),
})
export type NewList = InferInsertModel<typeof ListTable>;
export type List = InferSelectModel<typeof ListTable>;
