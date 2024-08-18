import BookCard from "@/components/book_card";
import PaginationControll from "@/components/pagination";
import { SearchControlls } from "@/components/search_controlls";
import {  Book, getFilteredBooks, getPaginatedBooks } from "@/lib/database/bookSchema";
import { auth } from "@/auth";
export default async function Page({searchParams}:{searchParams:any}) {
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || "";
  const sort = searchParams.sort || "";
  const session:any = await auth()
  if(!session) session.user.role = "VISITOR"
  const role = session?.user?.role
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
    <>
    <section className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-8">
    
      <section className="row-start-2 md:row-start-1 md:col-start-1 col-span-3 px-4">
      {books &&
        books.map((book, index) => (
            <BookCard key={index} book={book} role={role} />
        ))}
      </section>
      <aside className="row-start-1 md:col-start-4 w-full  mx-auto ">
       <div className="sticky top-0">
        {/* MAYBE switch to side sheet */}
       <SearchControlls/>
       </div>
      </aside>
      
    </section>
    <section className="my-2">
      <PaginationControll count={result?.total || 0} limit={LIMIT} />
    </section>
    </>
  );
}
