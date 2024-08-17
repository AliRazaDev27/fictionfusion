
import  {getAllShows} from "@/actions/showActions"
import { ShowCard } from "@/components/show_card"
import { Show } from "@/types"
export default async function Page({searchParams}) {
    console.log(searchParams)
    const result = await getAllShows()
    return(
        <div>
            {result.map((show) =>(
                <ShowCard show={show}/>
            ))}
        </div>
    )
}