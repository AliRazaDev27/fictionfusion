import { CreateList } from "@/components/create_list"
import { ListTable } from "@/components/list_table"
import Link from "next/link"
import { getShowList } from "@/actions/userListActions"
export default async function Page(){
    const data = await getShowList() 
    return(
       <div className="text-white md:w-[95%] ms-auto py-8 px-4">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl">Show Lists</h1>
            <CreateList listType="show"/>
        </div>
        <div className="mt-8">
<ListTable data={data}/>
        </div>
       </div>
    )
}
