"use server"
import { db } from "@/lib/database";
import { CelebListTable, NewCelebList } from "@/lib/database/celebSchema";
import { eq } from "drizzle-orm";
import * as cheerio from "cheerio"

export async function addCelebTODatabase(celeb: NewCelebList) {
  return await db.insert(CelebListTable).values(celeb).returning();
}

export async function setupCelebInfo(url:string){
  const result = await fetch(url)
  const response = await result.text()
  const content = cheerio.load(response)
  const title = content("#content > div > div.container-fluid > div > div.col-lg-4.col-md-4 > div > div:nth-child(1) > div.box-header.p-b-0.text-center > h1").text().trim();
  const avatar = content("#content > div > div.container-fluid > div > div.col-lg-4.col-md-4 > div > div:nth-child(1) > div.box-body > img").attr("src")?.trim();
  return await db.insert(CelebListTable).values({title, avatar, url}).returning();
}
export async function getCelebs(){
  // don't include the ignoredList in it
  return await db.select().from(CelebListTable)
}

export async function getCelebUrl(id: number) {
  const celeb = await db.query.CelebListTable.findFirst({
    columns: {
      url: true,
    },
    where: eq(CelebListTable.id, id),
  });
  return celeb?.url;
}

export async function extractRealTimeWorkInfo(url:string): Promise<Record<string, Film[]>>{
  const store: Record<string, Film[]> = {}
  const result = await fetch(url)
  const response = await result.text()
  const content = cheerio.load(response)
  // const name = content("#content > div > div.container-fluid > div > div.col-lg-4.col-md-4 > div > div:nth-child(1) > div.box-header.p-b-0.text-center > h1").text()
  // const avatar = content("#content > div > div.container-fluid > div > div.col-lg-4.col-md-4 > div > div:nth-child(1) > div.box-body > img").attr("src")
  const dramaTables = content("table.film-list");
  dramaTables.each((index, element) => {
  const crate: Film[] = new Array();
  const header = content(element).prev().text();
  // console.log(header)
  const rows = content(element).find("tbody > tr");
  // console.log(rows.length)
   rows.each((index, row) => {
     const children = content(row).children();
     // can be 4 or 5
    //  console.log(children.length)
     if(children.length === 4){
     const year = content(children[0]).text().trim();
     const title = content(children[1]).find("a").text().trim();
     const role = content(children[2]).text().trim();
     const rating = content(children[3]).text().trim();
     crate.push({year, title,episodes:"1", role, rating})
     }
     else if(children.length === 5){
     const year = content(children[0]).text().trim();
     const title = content(children[1]).find("a").text().trim();
     const episodes = content(children[2]).text().trim();
     const role = content(children[3]).text().trim();
     const rating = content(children[4]).text().trim();
     crate.push({year, title,episodes, role, rating})
     }
     else {
      // don't know what to do with this
      }
   })
   store[header] = crate 
  // use the header as key of object and store the table as named indexed, the entire table as the content like this
  // { [header]: content }
  })
  return store;
}

interface Film {
  year: string;
  title: string;
  episodes: string;
  role: string;
  rating: string;
}
