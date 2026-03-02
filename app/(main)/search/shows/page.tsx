import { searchShowByTitle } from "@/actions/showActions"
import { auth } from "@/auth"
import { AddShowToDB } from "@/components/add_show_to_db"
import { ShowCard } from "@/components/show_card"
import { Show } from "@/types"
export default async function Page(props:{searchParams: Promise<any>}) {
    const searchParams = await props.searchParams;
    const query = searchParams.query
    const session:any = await auth()
    const result = await searchShowByTitle(query)
    const role = session?.user?.role || "VISITOR";
    return(
        <div className="w-full min-h-[90vh] flex flex-col gap-6 py-6 px-4">
            {result.map((show:{show:Show}) =>(
                <div key={show.show.id} className="relative ">
                    <ShowCard show={show.show}/>
                    {role !== "VISITOR" && 
                    <div className="absolute top-2 right-2">
                    <AddShowToDB show={show.show}/>
                    </div>
                    }
                </div>
            )      
             )}
        </div>
    )
}