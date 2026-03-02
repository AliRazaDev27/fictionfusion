import { drizzle } from 'drizzle-orm/vercel-postgres';
import { InferSelectModel, InferInsertModel, eq } from 'drizzle-orm';
import { sql } from "@vercel/postgres";
import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export type User = InferSelectModel<typeof UserTable>;
export type NewUser = InferInsertModel<typeof UserTable>;

// Use this object to send drizzle queries to your DB
export const db = drizzle(sql);
// Create a pgTable that maps to a table in your DB
export const UserTable = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    password: text('password').notNull(),
    role: text('role').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().notNull(),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex('unique_idx').on(users.email),
    };
  },
);
