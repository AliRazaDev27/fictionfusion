import { pgTable,serial,varchar,text,timestamp } from "drizzle-orm/pg-core";

export const CelebListTable = pgTable("celeblists", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull().unique(),
  avatar: varchar("avatar", { length: 255 }),
  url: text("url").notNull().unique(),
  ignoredTitles: text("ignored_titles").array().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdateFn(() => new Date()),
});

export type CelebList = typeof CelebListTable.$inferSelect;
export type NewCelebList = typeof CelebListTable.$inferInsert;