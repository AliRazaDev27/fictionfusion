import { getListItems } from "@/actions/listActions"
import BookCard from "@/components/book_card"
import { MovieCard } from "@/components/movie_card"
import { ShowCard } from "@/components/show_card"

// add encryption method to secure this endpoint
export default async function Page(props) {
    const params = await props.params;
    const data = await getListItems(params.id)
    const result = data?.result
    const type = data?.type || "n/a"
    return(
        <div className="min-h-[90vh] w-full flex flex-col px-4 py-4:">
            {(type === "book") && result?.map((item:any,index:number)=>(
                <div key={index}>
                    <BookCard book={item}/>
                </div>
            ))}
             {(type === "movie") && result?.map((item:any,index:number)=>(
                <div key={index}>
                    <MovieCard movie={item}/>
                </div>
            ))}
             {(type === "show") && result?.map((item:any,index:number)=>(
                <div key={index}>
                    <ShowCard show={item}/>
                </div>
            ))}
        </div>
    )
} 