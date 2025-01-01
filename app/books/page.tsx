import BookCard from "@/components/book_card";
import {   getFilteredBooks } from "@/lib/database/bookSchema";
import { auth } from "@/auth";
import { getBookList } from "@/actions/userListActions";
import PaginationControll from "@/components/pagination"
import SearchAndFilter from "@/components/seach_filter_sheet"

export default async function Page(props:{searchParams: Promise<any>}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search;
  const sort = searchParams.sort;
  const LIMIT = 10;
  const [result,session,list] = await Promise.all([getFilteredBooks(page,LIMIT,search,sort),auth(),getBookList()])
  let role = (session as any)?.user?.role || "VISITOR";
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
