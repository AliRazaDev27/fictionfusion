import BookCard from "@/components/book_card";
import PaginationControll from "@/components/pagination";
import { SearchControlls } from "@/components/search_controlls";
import {  Book, getFilteredBooks, getPaginatedBooks } from "@/lib/database/bookSchema";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { auth } from "@/auth";
import { FaFilter } from "react-icons/fa";
export default async function Page({searchParams}:{searchParams:any}) {
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
    <div className="relative">
      <Sheet>
  <div className=" sticky mt-2 z-50 w-max ms-auto top-6 right-6  flex justify-end">
  <SheetTrigger  className=""><FaFilter className="size-5" /></SheetTrigger>
  </div>

  <SheetContent side="top" className="border border-red-500">
    <SheetTitle className="hidden">Search & Filter</SheetTitle>
    <SearchControlls/>
  </SheetContent>
</Sheet>
    <section className="">
    
      <section className=" px-4">
      {books &&
        books.map((book, index) => (
            <BookCard key={index} book={book} role={role} />
        ))}
      </section>
      
    </section>
    
    <section className="my-2">
      <PaginationControll count={result?.total || 0} limit={LIMIT} />
    </section>
    </div>
  );
}
