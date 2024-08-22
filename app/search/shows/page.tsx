import { getShowInfo, searchShowByTitle } from "@/actions/showActions"
import { auth } from "@/auth"
import { AddShowToDB } from "@/components/add_show_to_db"
import { ShowCard } from "@/components/show_card"
import { Button } from "@/components/ui/button"
import { Show } from "@/types"
export const dynamic = "force-dynamic"
export default async function Page({searchParams}:{searchParams:any}) {
    const query = searchParams.query
    const result = await searchShowByTitle(query)
    const session:any = await auth()
    const role = session?.user?.role || "VISITOR";
    return(
        <div className="flex flex-col gap-6 py-6 px-4 bg-gradient-to-b from-black/90 via-gray-800 to-gray-900">
           
            {result.map((show:{show:Show}) =>(
                <div key={show.show.id} className="relative ">
                    <ShowCard show={show.show}/>
                    {role !== "VISITOR" && <AddShowToDB show={show.show}/>}
                </div>
            )      
             )}
         
           
        </div>
    )
}