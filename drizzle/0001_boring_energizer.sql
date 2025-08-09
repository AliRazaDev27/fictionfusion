CREATE TABLE "celeblists" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"avatar" varchar(255),
	"ignored_titles" text[] DEFAULT '{}',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "celeblists_title_unique" UNIQUE("title")
);
--> statement-breakpoint
ALTER TABLE "books" ALTER COLUMN "openlibrary_work_key" SET DATA TYPE varchar(30);