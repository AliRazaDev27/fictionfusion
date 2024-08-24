import { InferSelectModel } from "drizzle-orm";
import { integer,boolean,numeric, pgTable,text,varchar } from "drizzle-orm/pg-core";

export const MovieTable = pgTable('movies', {
    id: integer('id').primaryKey(),
    adult: boolean('adult').notNull(),
    backdrop_path: varchar('backdrop_path', { length: 255 }).notNull(),
    genre_ids: (integer('genre_ids')).array(),
    original_language: varchar('original_language', { length: 10 }).notNull(),
    original_title: varchar('original_title', { length: 255 }).notNull(),
    overview: text('overview').notNull(),
    popularity: numeric('popularity').notNull(),
    poster_path: varchar('poster_path', { length: 255 }).notNull(),
    release_date: varchar('release_date', { length: 10 }).notNull(), // Assuming date is in 'YYYY-MM-DD' format
    title: varchar('title', { length: 255 }).notNull(),
    video: boolean('video').notNull(),
    vote_average: numeric('vote_average', { precision: 3, scale: 1 }).notNull(),
    vote_count: integer('vote_count').notNull(),
  });

  export type Movie = InferSelectModel<typeof MovieTable>;
