import { pgTable, serial, text, vector, timestamp } from "drizzle-orm/pg-core";

export const memories = pgTable("memories", {
    id: serial("id").primaryKey(),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 3072 }),
    createdAt: timestamp("created_at").defaultNow(),
});