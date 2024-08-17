
import  {getAllShows} from "@/actions/showActions"
import { DeleteShow } from "@/components/delete_show"
import { ShowCard } from "@/components/show_card"
import { Show } from "@/types"
import { FaTrashCan } from "react-icons/fa6"
export default async function Page({searchParams}) {
    console.log(searchParams)
    const result = await getAllShows()
    return(
        <div>
            {result.map((show) =>(
                <div className="relative">
<ShowCard show={show}/>
<DeleteShow id={show.id}/>

                </div>

            ))}
        </div>
    )
}