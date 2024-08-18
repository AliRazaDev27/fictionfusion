import { searchBookByTitle } from "@/actions/bookActions"
import { AddBookToDB } from "@/components/add_book_to_db"
import BookCard from "@/components/book_card"
import { Button } from "@/components/ui/button"
import { getOpenLibraryCoverLink } from "@/lib"
import type { Book } from "@/types"

export default async function Page({searchParams}:{searchParams:any}) {
    const query = searchParams.query
    const result = await searchBookByTitle(query)
    const jumbo = result?.docs
    const unique = new Set()
    const books:any = []
    for(let i=0;i<jumbo.length;i++){
        let book = jumbo[i]
        let identifer = book?.title + "," + book?.author_name
        if(!unique.has(identifer)){
            unique.add(identifer)
            books.push(book)
        }
    }

    return(
        <div className="px-4">     
            {books && books.map((book:Book,index:number)=> (
            <div key={index} className="relative">
                <BookCard book={book}  role="VISITOR"/>
                <AddBookToDB book={book} />
            </div>))}
        
        </div>
    )
}
