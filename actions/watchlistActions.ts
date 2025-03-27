"use server"
import jsdom from "jsdom"
import { getIgnoreList } from "./ignorelistActions";
import { ShowMyDramalist } from "@/types";
export async function getWatchlist(url:string) {
    const [result,ignoreList] = await Promise.all([fetch(url),getIgnoreList()]);
    const response = await result.text()
    const dom = new jsdom.JSDOM(response)
    const document = dom.window.document
    const shows = Array.from(document.querySelectorAll("#content .app-body .box[id^='mdl-']"));
    if (shows.length === 0) return [];
    const showData = shows.map(show => {
        const item: ShowMyDramalist = {};
        const titleElement = show.querySelector(".title a");
        const scoreElement = show.querySelector(".score");
        const rankingElement = show.querySelector(".ranking span");
        const infoElement = show.querySelector(".text-muted");
        const descriptionElement = show.querySelector("p:last-of-type");
        if (titleElement) {
          item.title = titleElement.innerHTML;
          item.link = (titleElement as HTMLAnchorElement)?.href;
        }
        if (scoreElement) item.rating = scoreElement.innerHTML;
        if (rankingElement) item.ranking = rankingElement.innerHTML;
        if (infoElement) item.info = infoElement.innerHTML;
        if (descriptionElement) item.description = descriptionElement.innerHTML;
        const imageElement = show.querySelector("[data-src]");
        if (imageElement) {
           item.image = imageElement.getAttribute("data-src") ?? undefined;
        }
    
        return item;
    });
    if(ignoreList.success === true){
      const filterValues = showData.filter((item:any)=>!ignoreList?.items?.includes(item.title))
      return filterValues;
    }
    else{
      return showData;  
    }
    
}
