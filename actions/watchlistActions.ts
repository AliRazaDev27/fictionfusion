"use server"
import jsdom from "jsdom"
export async function getWatchlist(url:string) {
    const result = await fetch(url);
    const response = await result.text()
    const dom = new jsdom.JSDOM(response)
    const document = dom.window.document
    const appBody = document.getElementById("content")?.getElementsByClassName("app-body")[0]
    const data = appBody?.children[1]?.firstElementChild?.firstElementChild?.querySelector('div')?.children
    if(!data) return "No Data Found"
    console.log(data)
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
    return showData
}
