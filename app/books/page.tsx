// import BookCard from "@/components/book_card";
import {   getFilteredBooks } from "@/lib/database/bookSchema";
import { auth } from "@/auth";
import { getBookList } from "@/actions/userListActions";
import { lazy,Suspense } from "react";
const BookCard = lazy(()=>import("@/components/book_card"))
const PaginationControll = lazy(()=>import("@/components/pagination"))
const SearchAndFilter = lazy(()=>import("@/components/seach_filter_sheet"))

// a few ways to improve performance, remove the list method, restructure to include inside the book data but will need to re structure (very tedious).

export default async function Page({searchParams}:{searchParams:any}) {
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search;
  const sort = searchParams.sort;
  const LIMIT = 10;
  // let result:{data:Book[],total:number}|null = {data:[],total:0};
  let start = performance.now();
  const [result,session,list] = await Promise.all([getFilteredBooks(page,LIMIT,search,sort),auth(),getBookList()])
  console.log("time taken in books", performance.now() - start);
  let role = (session as any)?.user?.role || "VISITOR"; 
  const books = result?.data;
  return (
    <div className="relative min-h-[90vh] py-4 ">
      <Suspense>
      <SearchAndFilter type="books" />
      </Suspense>
      <section className=" px-4">
      <Suspense>
        {books &&
        books.map((book, index) => (
            <BookCard key={index} book={book} role={role} list={list}/>
        ))}
      </Suspense>
      </section>
    <section className="py-2">
      <Suspense>
      <PaginationControll count={result?.total || 0} limit={LIMIT} />
      </Suspense>
    </section>
    </div>
  );
}
