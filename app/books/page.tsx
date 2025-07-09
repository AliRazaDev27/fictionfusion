import BookCard from "@/components/book_card";
import { Sidebar } from "./components/sidebar";
import { getBooks } from "@/actions/bookActions";

export default async function Page(props:{searchParams: Promise<any>}) {
  const searchParams = await props.searchParams;
  const books = await getBooks();
  console.log(books)
  return (
    <div className="relative min-h-[100svh - 70px]">
      <div className="flex items-center">
      {/* <Sidebar /> */}
      <section className="p-4 w-full flex flex-col gap-16 items-center border border-white">
        {books &&
        books.map((book, index) => (
            <BookCard key={index} book={book}/>
        ))}
      </section>
      </div>
    </div>
  );
}
