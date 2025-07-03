import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import {InferSelectModel,InferInsertModel} from "drizzle-orm";
import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
  index,
  unique
} from "drizzle-orm/pg-core";
import {  SortBook } from "@/types";
import { asc, desc} from "drizzle-orm";
export const db = drizzle(sql);
export const BookTable = pgTable(
  "books",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    author_name: text("author_name").array().$type<string[]>(),
    author_key: text("author_key").array().$type<string[]>(),
    cover_edition_key: varchar("cover_edition_key", { length: 16 }).notNull(),
    openlibrary_work_key: varchar("openlibrary_work_key", { length: 30 }).notNull(),
    first_publish_year: integer("first_publish_year").notNull(),
    description: text("description"),
    number_of_pages: integer("number_of_pages"),
    rating: decimal("rating", { precision: 3, scale: 2 }),
    tags: text("tags").array().$type<string[]>(),
    covers: text("covers").array().$type<string[]>(),
    isRead: boolean("isRead").default(false),
    isFav: boolean("isFav").default(false),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull().$onUpdateFn(() => new Date()),
  },
  (books) => ({
    // 🔐 Unique constraints
    uniqueWorkKey: unique("books_openlibrary_work_key_unique").on(books.openlibrary_work_key),
    uniqueEditionKey: unique("books_cover_edition_key_unique").on(books.cover_edition_key),

    // ⚡ Indexes for better search/query performance
    titleIdx: index("books_title_idx").on(books.title),
    authorNameIdx: index("books_author_name_idx").on(books.author_name),
    tagsIdx: index("books_tags_idx").on(books.tags),
    isReadIdx: index("books_is_read_idx").on(books.isRead),
    isFavIdx: index("books_is_fav_idx").on(books.isFav),
  })
);

export type NewBook = InferInsertModel<typeof BookTable>;
export type Book = InferSelectModel<typeof BookTable>;

export const bookSortOption: SortBook = {
  year_newest: desc(BookTable.first_publish_year),
  year_oldest: asc(BookTable.first_publish_year),
  rating_max: desc(BookTable.rating),
  rating_min: asc(BookTable.rating),
  pages_max: desc(BookTable.number_of_pages),
  pages_min: asc(BookTable.number_of_pages),
};