CREATE TABLE "books" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"author_name" text[],
	"author_key" text[],
	"cover_edition_key" varchar(16) NOT NULL,
	"openlibrary_work_key" varchar(16) NOT NULL,
	"first_publish_year" integer NOT NULL,
	"description" text,
	"number_of_pages" integer,
	"rating" numeric(3, 2),
	"tags" text[],
	"covers" text[],
	"isRead" boolean DEFAULT false,
	"isFav" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "books_openlibrary_work_key_unique" UNIQUE("openlibrary_work_key"),
	CONSTRAINT "books_cover_edition_key_unique" UNIQUE("cover_edition_key")
);
--> statement-breakpoint
CREATE TABLE "ignorelists" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"items" varchar[] DEFAULT '{}',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lists" (
	"id" serial PRIMARY KEY NOT NULL,
	"listname" varchar(255) NOT NULL,
	"creator" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"items" integer[] DEFAULT '{}',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "lists_listname_unique" UNIQUE("listname")
);
--> statement-breakpoint
CREATE TABLE "movies" (
	"id" integer PRIMARY KEY NOT NULL,
	"adult" boolean NOT NULL,
	"backdrop_path" varchar(255) NOT NULL,
	"genre_ids" integer[],
	"original_language" varchar(10) NOT NULL,
	"original_title" varchar(255) NOT NULL,
	"overview" text NOT NULL,
	"popularity" numeric NOT NULL,
	"poster_path" varchar(255) NOT NULL,
	"release_date" varchar(10) NOT NULL,
	"title" varchar(255) NOT NULL,
	"video" boolean NOT NULL,
	"vote_average" numeric(3, 1) NOT NULL,
	"vote_count" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "music" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"artist" varchar(255) NOT NULL,
	"album" varchar(255),
	"category" text[],
	"uploaded_by" varchar(100),
	"cover_art" text,
	"release_date" date,
	"language" varchar(50),
	"duration" interval,
	"file_url_public" text,
	"file_url_private" text,
	"is_public" boolean DEFAULT true,
	"upload_date" timestamp DEFAULT now(),
	"modified_date" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "shows" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(64) NOT NULL,
	"type" varchar(10),
	"language" varchar(64),
	"genres" varchar(16)[],
	"status" varchar(16),
	"runtime" varchar(4),
	"premiered" text,
	"ended" text,
	"rating" numeric(3, 1),
	"image" json,
	"summary" text
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"task_name" varchar(255) NOT NULL,
	"task_desc" text NOT NULL,
	"task_time" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_lists" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"booklists" integer[],
	"movielists" integer[],
	"showlists" integer[],
	"musiclists" integer[]
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "books_title_idx" ON "books" USING btree ("title");--> statement-breakpoint
CREATE INDEX "books_author_name_idx" ON "books" USING btree ("author_name");--> statement-breakpoint
CREATE INDEX "books_tags_idx" ON "books" USING btree ("tags");--> statement-breakpoint
CREATE INDEX "books_is_read_idx" ON "books" USING btree ("isRead");--> statement-breakpoint
CREATE INDEX "books_is_fav_idx" ON "books" USING btree ("isFav");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_idx" ON "users" USING btree ("email");