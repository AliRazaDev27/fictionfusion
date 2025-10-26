import { pgTable, serial, text, timestamp, varchar, integer, jsonb, pgEnum } from "drizzle-orm/pg-core";

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  topic: varchar("topic", { length: 255 }).notNull(),
  description: text("description"),
  questionCount: integer("question_count").notNull(),
  data: jsonb("data").notNull(), // To store the full quiz object
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const quizTopics = pgTable("quiz_topics", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description"),
  displayOrder: integer("display_order").default(0).notNull(), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});


export const quizDifficultyEnum = pgEnum("quiz_difficulty",
   ["beginner", "intermediate", "advanced","mixed"]);

export const quizQuestionTypeEnum = pgEnum("quiz_question_type",
   ["multiple-choice", "debug", "output", "fill-blanks", "concept"]);   

export const quizCollection = pgTable("quiz_collection", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  data: jsonb("data").notNull(),
  topicId: integer("topic_id").notNull().references(() => quizTopics.id, {
    onDelete: "cascade" // If you delete a topic, delete its quizzes
  }),
  displayOrder: integer("display_order").default(0).notNull(),
difficulty: quizDifficultyEnum("difficulty").notNull(),
  questionTypes: quizQuestionTypeEnum("question_types").array().notNull(),
  tags: text("tags").array(),
  questionCount: integer("question_count").notNull(), // Good to keep this
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});