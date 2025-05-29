"use server"
import jsdom from "jsdom"
import { getIgnoreList } from "./ignorelistActions";
import { ShowMyDramalist } from "@/types";
import { mydramalistScrapper } from "@/lib/mydramalistScrapper";
import { auth } from "@/auth";
import { addShow } from "./showActions";
export async function getWatchlist(url: string) {
  // const [result, ignoreList] = await Promise.all([fetch(url), getIgnoreList()]);
  const result = await fetch(url);
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
  // if (ignoreList.success === true) {
  //   const filterValues = showData.filter((item: any) => !ignoreList?.items?.includes(item.title))
  //   return filterValues;
  // }
  // else {
  //   return showData;
  // }

  return showData

}

export async function addMyDramalistShow(url: string) {
  try {
    const session:any = await auth();
    const role = session?.user?.role || "VISITOR";
    if(role !== "ADMIN") throw new Error("Not Authorized")
    if(!(url.startsWith('https://mydramalist.com/'))) throw new Error("Invalid URL");  
    const result = await fetch(url);
    const textContent = await result.text();
    const data = await mydramalistScrapper(textContent);
    console.log(data)
    if (data.id === 0) throw new Error("Invalid ID");
    if (data.name === "unknown") throw new Error("Invalid Name");
    const response = await addShow(data)
    return response;
  }
  catch (error:any) {
    console.log(error)
    return { success: false, message: error.message };
  }
}
