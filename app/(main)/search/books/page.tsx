import { searchBookByTitle } from "@/actions/bookActions"
import { BookItem } from "./book-item"

export default async function Page(props: { searchParams: Promise<any> }) {
    const searchParams = await props.searchParams;
    const query = searchParams.query
    const books = await searchBookByTitle(query)

    return (
        <div className="min-h-screen bg-black text-white px-6 py-12 lg:py-20">
            <div className="max-w-7xl mx-auto space-y-16">
                <header className="space-y-4 max-w-2xl">
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter italic">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-400 to-zinc-600">
                            Search Results
                        </span>
                    </h1>
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs flex items-center gap-3">
                        <span className="w-8 h-px bg-zinc-800" />
                        Found {books?.length || 0} matches for "{query}"
                    </p>
                </header>

                <div className="flex flex-col gap-12">
                    {books && books.map((book, index: number) => (
                        <div key={`book-${book.title}-${index}`} className="relative">
                            <BookItem book={book} index={index} />
                        </div>
                    ))}
                </div>

                {(!books || books.length === 0) && (
                    <div className="text-center py-32 bg-zinc-950 border-2 border-dashed border-zinc-900 rounded-[2rem]">
                        <p className="text-zinc-600 font-black uppercase tracking-widest text-sm">No artifacts found in the void.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

