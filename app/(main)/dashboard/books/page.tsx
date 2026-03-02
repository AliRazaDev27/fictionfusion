import { CreateList } from "@/components/create_list"
import { ListTable } from "@/components/list_table"
import Link from "next/link"
import { getBookList } from "@/actions/userListActions"
export default async function Page(){
    const data = await getBookList() 
    return(
       <div className="text-white md:w-[95%] ms-auto py-8 px-4">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl">Book Lists</h1>
            <CreateList listType="book"/>
        </div>
        <div className="mt-8">
<ListTable data={data}/>
        </div>
       </div>
    )
}

