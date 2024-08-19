
import  {getAllShows} from "@/actions/showActions"
import { DeleteShow } from "@/components/delete_show"
import { ShowCard } from "@/components/show_card"
import { Show } from "@/types"
import { FaTrashCan } from "react-icons/fa6" 
import { auth } from "@/auth"
export default async function Page({searchParams}:{searchParams:any}) {
    const session:any = await auth()
  const role = session?.user?.role || "VISITOR";
    const result = await getAllShows()
    return(
        <div>
            {result.map((show) =>(
                <div key={show.id} className="relative">
<ShowCard show={show}/>
{role === "ADMIN" && <DeleteShow id={show.id}/>}
                </div>

            ))}
        </div>
    )
}