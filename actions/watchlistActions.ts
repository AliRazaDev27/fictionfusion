"use server"
import { getIgnoreList } from "./ignorelistActions";
import { ShowMyDramalist } from "@/types";
import { mydramalistScrapper } from "@/lib/mydramalistScrapper";
import { auth } from "@/auth";
import { addShow } from "./showActions";
import { Impit } from 'impit';

import * as cheerio from 'cheerio';


export async function getWatchlist(url: string,email:string|null) {
  const impit = new Impit({
    browser: "chrome", // or "firefox"
    proxyUrl: "http://localhost:8080",
    ignoreTlsErrors: true,
});
  const a = performance.now();
  const [result, ignoreList] = await Promise.all([impit.fetch(url), getIgnoreList(email)]);
  console.log("res:",result)
  // const result = await fetch(url);
  // const ignoreList = { success: false, items: Array() };
  console.log("fetch+ignorelist: ",performance.now() - a);
  const html = await result.text();
  console.log("html:", html);
  const start = performance.now();
  const $ = cheerio.load(html);

  const shows: ShowMyDramalist[] = [];

  $("#content .app-body .box[id^='mdl-']").each((_, el) => {
    const $el = $(el);
    const item: ShowMyDramalist = {};

    const titleElement = $el.find(".title a");
    const scoreElement = $el.find(".score");
    const rankingElement = $el.find(".ranking span");
    const infoElement = $el.find(".text-muted");
    const descriptionElement = $el.find("p").last();
    const imageElement = $el.find("[data-src]");

    if (titleElement.length) {
      item.title = titleElement.html() ?? '';
      item.link = titleElement.attr("href");
    }
    if (scoreElement.length) item.rating = scoreElement.html() ?? '';
    if (rankingElement.length) item.ranking = rankingElement.html() ?? '';
    if (infoElement.length) item.info = infoElement.html() ?? '';
    if (descriptionElement.length) item.description = descriptionElement.html() ?? '';
    if (imageElement.length) item.image = imageElement.attr("data-src");

    shows.push(item);
  });
  console.log(`Time taken: ${performance.now() - start}ms`);


  if (!!ignoreList) {
    const filterValues = shows.filter((item: any) => !ignoreList?.includes(item.title))
    return filterValues;
  }
  else {
    return shows;
  }
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
