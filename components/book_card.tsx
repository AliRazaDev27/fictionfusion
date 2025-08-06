"use client";
import Image from "next/image";
import placeholder from "@/public/bookplaceholder.svg";
import { getOpenLibraryCoverLink } from "@/lib";
import { Book } from "@/types";
import React from "react";
import Link from "next/link";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaStar, FaCalendarAlt, FaBookOpen } from "react-icons/fa";

export default function BookCard({ book }: { book: Book }) {
  const rating = book?.rating ?? (book as any)?.ratings_average ?? "0";

  return (
    <Card className="flex flex-wrap w-full h-full overflow-hidden rounded-lg shadow-xl shadow-cyan-900 hover:shadow-lg transition-shadow duration-300 ease-in-out">
      <CardHeader className="w-full sm:w-1/3">
        <div className="relative aspect-[2/3]">
          <Image
            src={getOpenLibraryCoverLink(book.cover_edition_key)}
            alt={book.title}
            fill
            quality={90}
            className="object-cover"
            placeholder="blur"
            blurDataURL={placeholder.src}
            onError={(e) => {
              e.currentTarget.src = placeholder.src;
            }}
          />
        </div>
      </CardHeader>
      <CardContent className="w-full sm:w-2/3 p-4">
        <CardTitle className="text-3xl font-semibold mb-2 leading-tight">
          <Link prefetch={false} href={`/books/${book.id}`} className="hover:border-b-2 border-black transition-colors">
            {book.title}
          </Link>
        </CardTitle>
        <div className="text-lg text-gray-700 font-medium mb-3">
          by{" "}
          {book.author_name?.map((author, index) => (
            <React.Fragment key={book.author_key?.[index] ?? index}>
              <Link
                href={`/author/${book.author_key?.[index]}`}
                className="hover:text-primary transition-colors"
              >
                {author}
              </Link>
              {index < (book.author_name?.length ?? 0) - 1 && ", "}
            </React.Fragment>
          ))}
        </div>
        <div className="flex items-center gap-8 md:gap-16 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-500" />
            <span>{Number(rating).toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaCalendarAlt />
            <span>{book.first_publish_year}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaBookOpen />
            <span>{book.number_of_pages}</span>
          </div>
        </div>
        <div className="my-4">
          {book.description}
        </div>
        <div className="flex flex-wrap gap-2">
          {book.tags?.slice(0, 3).map((tag) => (
            <Badge key={tag} className="text-xs sm:text-sm" variant="default">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
