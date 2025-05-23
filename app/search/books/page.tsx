import { searchBookByTitle } from "@/actions/bookActions"
import { AddBookToDB } from "@/components/add_book_to_db"
import BookCard from "@/components/book_card"
import type { Book } from "@/types"
export const dynamic = "force-dynamic"
import { auth } from "@/auth"
export default async function Page(props:{searchParams: Promise<any>}) {
    const searchParams = await props.searchParams;
    const query = searchParams.query
    const unique = new Set()
    const books:any = []
    const session:any = await auth()
    const role = session?.user?.role || "VISITOR";
    const result = await searchBookByTitle(query)
    const jumbo = result?.docs
    for(let i=0;i<jumbo.length;i++){
        let book = jumbo[i]
        let identifer = book?.title + "," + book?.author_name
        if(!unique.has(identifer)){
            unique.add(identifer)
            books.push(book)
        }
    }

    return(
        <div className="flex flex-col gap-4 px-4 py-6 ">     
            {books && books.map((book:Book,index:number)=> (
            <div key={index} className="relative">
                <BookCard book={book}/>
                {role === "ADMIN" && <AddBookToDB book={book} />}
            </div>))}
        
        </div>
    )
}
