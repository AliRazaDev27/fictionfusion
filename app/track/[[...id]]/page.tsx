import { getShowByID } from "@/actions/showActions"
import { Badge } from "@/components/ui/badge"
import jsdom from "jsdom"
import Image from "next/image"
export default async function Page({params}){
    const id = params.id[0]
    const show = await getShowByID(id)
    const title = encodeURIComponent(show.name)
    const result = await fetch(`https://mydramalist.com/search?q=${title}`)
    const response = await result.text()
    const dom = new jsdom.JSDOM(response)
    const data = dom.window.document.getElementById("content")?.firstElementChild?.children[1]?.firstElementChild?.firstElementChild?.children[1]?.children
    if(!data) return
    let onlyShows:any = []
    let showData:any = []
    for(let i=0;i<data.length;i++){
        if(data[i].id.startsWith("mdl")){
            onlyShows.push(data[i])
        }
    }
    for(let i=0;i<onlyShows.length;i++){
        let item:any = {}
        let show = onlyShows[i].firstElementChild?.firstElementChild?.children
        let image = show[0].firstElementChild.firstElementChild.firstElementChild.getAttribute("data-src") as string
        let title = show[1].getElementsByClassName("title")[0].firstElementChild.innerHTML as string
        let link = show[1].getElementsByClassName("title")[0].firstElementChild.href as string
        let rating = show[1].getElementsByClassName("score")[0].innerHTML as string
        if(image) item.image = image
        if(rating) item.rating = rating
        if(title) item.title = title
        if(link) item.link = link
        showData.push(item)
    }
    
    
    console.log(showData)
    return(
        <div className="container mx-auto grid grid-cols-3 gap-8 px-4 py-8">
            {
                showData.map((item:any,index:number)=>(
                    <div key={index} className="border border-red-500 flex flex-col items-center gap-4 rounded-lg p-4 text-center">
                        <div className="relative overflow-hidden w-1/2 border border-yellow-500 mx-auto aspect-[2/3]">
                            <Image src={item.image}  alt="cover" fill className="bg-cover"/>
                        </div>
                        <div className="flex items-center gap-4">
                            <p className="font-semibold text-white text-lg">{item.title}</p>
                            <Badge className="bg-orange-500 text-white text-lg">{item.rating}</Badge>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}