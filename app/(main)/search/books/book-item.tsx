import { bookSearchResult, getBookWorkFromOL } from "@/actions/bookActions";

import { BookCard } from "./book-card";

export async function BookItem({ book, index }: { book: bookSearchResult, index: number }) {
    // Format published date
    const details = await getBookWorkFromOL(book.key);
    if (!details.description) {
        details.description = "No description available.";
    }
    details.description = typeof details.description === 'string' ? details.description : details.description.value;

    return (
        <BookCard book={book} details={details} index={index} />
    )
}
