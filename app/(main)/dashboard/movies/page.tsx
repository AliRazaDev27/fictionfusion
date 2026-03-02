import { CreateList } from "@/components/create_list"
import { ListTable } from "@/components/list_table"
import Link from "next/link"
import { getMovieList } from "@/actions/userListActions"
export default async function Page(){
    const data = await getMovieList()
    return(
       <div className="text-white md:w-[95%] ms-auto py-8 px-4">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl">Movie Lists</h1>
            <CreateList listType="movie"/>
        </div>
        <div className="mt-8">
<ListTable data={data}/>
        </div>
       </div>
    )
}
