import { db } from "./index";
import { integer, pgTable,serial,timestamp,varchar } from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const IgnoneListTable = pgTable("ignorelists", {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    items:varchar("items").array().default([]),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdateFn(() => new Date()), 
})
export type NewList = InferInsertModel<typeof IgnoneListTable>;
export type List = InferSelectModel<typeof IgnoneListTable>;