import { pgTable, serial, text, timestamp, varchar, integer, jsonb } from "drizzle-orm/pg-core";

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  topic: varchar("topic", { length: 255 }).notNull(),
  description: text("description"),
  questionCount: integer("question_count").notNull(),
  data: jsonb("data").notNull(), // To store the full quiz object
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
