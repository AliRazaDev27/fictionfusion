import { pgTable, serial, varchar, text, date, timestamp, boolean, interval } from 'drizzle-orm/pg-core';
import {InferSelectModel,InferInsertModel} from "drizzle-orm";

export const MusicTable = pgTable('music', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  artist: varchar('artist', { length: 255 }).notNull(),
  album: varchar('album', { length: 255 }),
  category: (text('category').array()), // Array of categories
  uploadedBy: varchar('uploaded_by', { length: 100 }),
  coverArt: text('cover_art'),
  releaseDate: date('release_date'),
  language: varchar('language', { length: 50 }),
  duration: interval('duration'), // Duration of the music track
  fileUrlPublic: text('file_url_public'), // URL for public access
  fileUrlPrivate: text('file_url_private'), // URL for private access
  isPublic: boolean('is_public').default(true), // Indicates if the music is public
  uploadDate: timestamp('upload_date').defaultNow(),
  modifiedDate: timestamp('modified_date').defaultNow(),
});

export type Music = InferSelectModel<typeof MusicTable>;
export type NewMusic = InferInsertModel<typeof MusicTable>;