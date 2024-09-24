import { getShowByID } from "@/actions/showActions"
import { ShowRatingUpdateCard } from "@/components/show_rating_update_card"

import jsdom from "jsdom"

export default async function Page({params}){
    const id = params.id[0]
    const show = await getShowByID(id)
    const title = encodeURIComponent(show.name)
    const result = await fetch(`https://mydramalist.com/search?q=${title}`)
    const response = await result.text()
    const dom = new jsdom.JSDOM(response)
    const appBody = dom.window.document.getElementById("content")?.getElementsByClassName("app-body")[0]
    const data = appBody?.children[1]?.firstElementChild?.firstElementChild?.children[1]?.children
    if(!data) return <div className="w-full min-h-[90vh] flex justify-center items-center text-5xl text-white">No Data Found</div>
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
        let ranking = show[1].getElementsByClassName("ranking")[0]?.children[0]?.innerHTML as string
        let info = show[1].getElementsByClassName("text-muted")[0]?.innerHTML
        let description = show[1].querySelector("p:last-of-type")?.innerHTML
        if(image) item.image = image
        if(rating) item.rating = rating
        if(title) item.title = title
        if(link) item.link = link
        if(ranking) item.ranking = ranking
        if(info) item.info = info
        if(description) item.description = description

        showData.push(item)
    }
     
    return(
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4 py-8">
            {
                showData.map((item:any,index:number)=>(
                    <ShowRatingUpdateCard key={index} item={item} id={id}/>
                ))
            }
        </div>
    )
}