import BookCard from "@/components/book_card";
import PaginationControll from "@/components/pagination";

import {  Book, getFilteredBooks, getPaginatedBooks } from "@/lib/database/bookSchema";

import { auth } from "@/auth";
import { SearchAndFilter } from "@/components/seach_filter_sheet";
import { getBookList } from "@/actions/userListActions";

export default async function Page({searchParams}:{searchParams:any}) {
  const list = await getBookList()
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || "";
  const sort = searchParams.sort || "";
  const session:any = await auth()
  const role = session?.user?.role || "VISITOR";
  const LIMIT = 10;
  let result:{data:Book[],total:number}|null = {data:[],total:0};
  if(search !== "" || sort !== ""){
     result = await getFilteredBooks(search,sort,page,LIMIT);
  }
  else{
     result = await getPaginatedBooks(LIMIT, (page - 1) * 10);
  }
  const books = result?.data;
  return (
    <div className="relative min-h-[90vh] py-4 ">
      <SearchAndFilter type="books" />
      <section className=" px-4">
      {books &&
        books.map((book, index) => (
            <BookCard key={index} book={book} role={role} list={list}/>
        ))}
      </section>
    <section className="py-2">
      <PaginationControll count={result?.total || 0} limit={LIMIT} />
    </section>
    </div>
  );
}
