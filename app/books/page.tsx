import BookCard from "@/components/book_card";
import PaginationControll from "@/components/pagination";
import RatingStar from "@/components/ratingStar";
import { SearchControlls } from "@/components/search_controlls";
import { getOpenLibraryCoverLink } from "@/lib";
import { getBookTable, getFilteredBooks, getPaginatedBooks } from "@/lib/database/bookSchema";


export default async function Page({searchParams}:{searchParams:any}) {
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || "";
  const sort = searchParams.sort || "";
  console.log("page",page,"search",search,"sort",sort)
  const LIMIT = 10;
  let result = null;
  if(search !== "" || sort !== ""){
     result = await getFilteredBooks(search,sort);
  }
  else{
     result = await getPaginatedBooks(LIMIT, (page - 1) * 10);
  }
  const books = result.data;
  return (
    <>
    <section className="grid grid-cols-1 md:grid-cols-4 border border-red-500">
      <section className="col-span-3">
      {books &&
        books.map((book, index) => (
          <BookCard key={index} book={book} />
        ))}
      </section>
      <aside className="col-span-1 border border-blue-500">
       <SearchControlls/>
      </aside>
    </section>
    <section>
      <PaginationControll count={result.total} limit={LIMIT} />
    </section>
    </>
  );
}
