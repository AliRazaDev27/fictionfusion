import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import {InferSelectModel,InferInsertModel} from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  integer,
  varchar,
  char,
  decimal,
} from "drizzle-orm/pg-core";
import {  SortBook } from "@/types";
import { asc, count, desc, eq, ilike, like } from "drizzle-orm";

export const db = drizzle(sql);

export const BookTable = pgTable("books", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  author_name: varchar("author_name", { length: 255 }).notNull(),
  author_id: varchar("author_id", { length: 20 }).notNull(),
  cover_edition_key: char("cover_edition_key", { length: 11 }).notNull(),
  first_publish_year: char("first_publish_year", { length: 4 }).notNull(),
  first_sentence: text("first_sentence"),
  description: text("description"),
  number_of_pages: integer("number_of_pages"),
  rating: decimal("rating"),
});

export type NewBook = InferInsertModel<typeof BookTable>;
export type Book = InferSelectModel<typeof BookTable>;

export const addBook = async (book: NewBook) => {
  const insertResult = await db.insert(BookTable).values(book).returning();
  return insertResult;
};

export const getBookTable = async () => {
  const selectResult = await db.select().from(BookTable).limit(10);
  return selectResult;
};
export const getBook = async () => {
  const selectResult = await db.select().from(BookTable).limit(1);
  return selectResult;
};
export const getPaginatedBooks = async (limit: number, offset: number) => {
  let start = performance.now();
  const [selectResult,total] = await Promise.all([
    db
      .select()
      .from(BookTable)
      .orderBy(asc(BookTable.id))
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(BookTable),
  ])
  console.log("time taken", performance.now() - start);
  return { data: selectResult, total: total[0].count };
};
export const getFilteredBooks = async (
  page=1,
  limit=9,
  search?: string,
  sort?: string,
) => {
  // maybe  fix the max rating order issue?
  const selectResult = db.select().from(BookTable);
  const countBooks = db.select({ count: count() }).from(BookTable);
  if (search) {
    selectResult.where(ilike(BookTable.title, `%${search}%`));
    countBooks.where(ilike(BookTable.title, `%${search}%`));
  }
  if (sort) {
    selectResult.orderBy(bookSortOption[sort]);
  }
  else{
    selectResult.orderBy(asc(BookTable.id))
  }
  selectResult.limit(limit).offset(limit * (page - 1));
  const [data,total] = await Promise.all([
    selectResult,
    countBooks,
  ])
  return { data: data, total: total[0].count };
};

export const setCoverImage = async (value: string, id: number) => {
  try {
    await db
      .update(BookTable)
      .set({ cover_edition_key: value })
      .where(eq(BookTable.id, id));
    return { success: true };
  } catch (err:any) {
    console.log(err);
    return { success: false, message: err.message };
  }
};

export const updateBook = async (
  id: number,
  title?: string,
  author?: string,
  year?: string,
  sentence?: string
) => {
  try {
if(!title && !author && !year && !sentence){
  return
}
    const book = {};
    if (!!title) book["title"] = title;
    if (!!author) book["author_name"] = author;
    if (!!year) book["first_publish_year"] = year;
    if (!!sentence) book["first_sentence"] = sentence;

    await db.update(BookTable).set(book).where(eq(BookTable.id, id));
    return { success: true };
  } catch (err:any) {
    console.log(err);
    return { success: false, message: err.message };
  }
};

export const bookSortOption: SortBook = {
  year_newest: desc(BookTable.first_publish_year),
  year_oldest: asc(BookTable.first_publish_year),
  rating_max: desc(BookTable.rating),
  rating_min: asc(BookTable.rating),
  pages_max: desc(BookTable.number_of_pages),
  pages_min: asc(BookTable.number_of_pages),
};
