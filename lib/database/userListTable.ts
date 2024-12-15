import { pgTable,serial,integer,varchar } from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";
export const UserListTable = pgTable("user_lists", {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    bookLists: integer("booklists").notNull().array(),
    movieLists: integer("movielists").notNull().array(),
    showLists: integer("showlists").notNull().array(),
    musicLists: integer("musiclists").notNull().array(),
})
export type NewUserList = InferInsertModel<typeof UserListTable>;
export type UserList = InferSelectModel<typeof UserListTable>