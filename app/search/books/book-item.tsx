import { bookSearchResult , getBookWorkFromOL } from "@/actions/bookActions";

import { BookCard } from "./book-card";

export async function BookItem({ book }: { book: bookSearchResult }) {
    // Format published date
    const details = await getBookWorkFromOL(book.key);
    if (!details.description) {
        details.description = "No description available.";
    }
    details.description = typeof details.description === 'string' ? details.description : details.description.value;
    details.description = details.description.split(' ([source][1])')[0] // Remove source link if present

    return (
        <BookCard book={book} details={details}/>
    )
}
