import BookCard from "@/components/book_card";
import RatingStar from "@/components/ratingStar";
import { getOpenLibraryCoverLink } from "@/lib";
import { getBookTable } from "@/lib/database/bookSchema";


export default async function Page() {
  const books = await getBookTable();
  return (
    <section>
      {books &&
        books.map((book, index) => (
          <BookCard key={index} book={book} />
        ))}
    </section>
  );
}
