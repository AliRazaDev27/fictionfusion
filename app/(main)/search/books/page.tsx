import { searchBookByTitle } from "@/actions/bookActions"
import { BookItem } from "./book-item"

export default async function Page(props: { searchParams: Promise<any> }) {
    const searchParams = await props.searchParams;
    const query = searchParams.query
    const books = await searchBookByTitle(query)

    return (
        <div className="flex flex-col gap-4 px-4 py-6 ">
            {books && books.map((book, index: number) => (
                <div key={`book-${book.title}-${index}`} className="relative">
                    <BookItem book={book} />
                </div>
                ))
            }

        </div>
    )
}

