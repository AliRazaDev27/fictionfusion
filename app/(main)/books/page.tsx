"use client";
import BookCard from "@/components/book_card";
import { getBooks } from "@/actions/bookActions";
import { useEffect, useState, useRef, useCallback } from "react";

export default function Page() {
  const limit = 12;
  const [allBooks, setAllBooks] = useState<any[]>([]);
  const [displayedBooks, setDisplayedBooks] = useState<any[]>([]);
  const [offset, setOffset] = useState(0);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getBooks().then((res) => {
      if (res.success && res.books) {
        setAllBooks(res.books);
        console.log(res.books);
        setDisplayedBooks(res.books.slice(0, limit));
        setOffset(limit);
      }
    });
  }, []);

  const loadMoreBooks = useCallback(() => {
    if (offset >= allBooks.length) {
      return;
    }
    const newOffset = offset + limit;
    const newBooks = allBooks.slice(offset, newOffset);
    setDisplayedBooks((prevBooks) => [...prevBooks, ...newBooks]);
    setOffset(newOffset);
  }, [offset, allBooks, limit]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreBooks();
        }
      },
      { threshold: 1 }
    );

    const currentRef = triggerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loadMoreBooks]);

  return (
    <div className="relative min-h-[100svh - 70px]">
      <div className="flex items-center">
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-8 w-full overflow-y-auto">
          {displayedBooks.map((book, index) => (
            <BookCard key={index} book={book} />
          ))}
        </section>
      </div>
      {offset < allBooks.length && <div ref={triggerRef} />}
    </div>
  );
}
