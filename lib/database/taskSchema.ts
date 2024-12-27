import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const TaskTable = pgTable("tasks", {
    id: serial("id").primaryKey(),
    taskName: varchar("task_name", { length: 255 }).notNull(),
    taskDesc: text("task_desc").notNull(),
    taskTime: text("task_time").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdateFn(() => new Date()), 
});

export type NewTask = InferInsertModel<typeof TaskTable>;
export type Task = InferSelectModel<typeof TaskTable>;