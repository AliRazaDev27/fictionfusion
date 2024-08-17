import { getShowInfo, searchShowByTitle } from "@/actions/showActions"
import { AddShowToDB } from "@/components/add_show_to_db"
import { ShowCard } from "@/components/show_card"
import { Button } from "@/components/ui/button"
import { Show } from "@/types"
export default async function Page({searchParams}:{searchParams:any}) {
    const query = searchParams.query
    const result = await searchShowByTitle(query)
    return(
        <div>
           
            {result.map((show:{show:Show}) =>(
                <div key={show.show.id} className="relative border-2 border-red-600">
                    <ShowCard show={show.show}/>
                    <AddShowToDB show={show.show}/>
                </div>
            )      
             )}
         
           
        </div>
    )
}