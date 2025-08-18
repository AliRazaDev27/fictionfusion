"use server"
import { db } from "@/lib/database";
import { CelebListTable, NewCelebList } from "@/lib/database/celebSchema";
import { eq } from "drizzle-orm";
import * as cheerio from "cheerio"
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function createCeleb(values: NewCelebList) {
  try{
  const session = await auth();
  if(session?.user?.role !== "ADMIN") return
  await db.insert(CelebListTable).values(values);
  revalidatePath("/people")
  }
  catch(e){
    console.log(e)
  }
}

export async function setupCelebInfo(url: string) {
  try {
    if (!url) return
    if (!url.startsWith('https://mydramalist.com/people/')) return
    const session = await auth();
    if(session?.user?.role !== "ADMIN") return
    const result = await fetch(url)
    const response = await result.text()
    const content = cheerio.load(response)
    const title = content("#content > div > div.container-fluid > div > div.col-lg-4.col-md-4 > div > div:nth-child(1) > div.box-header.p-b-0.text-center > h1").text().trim();
    const avatar = content("#content > div > div.container-fluid > div > div.col-lg-4.col-md-4 > div > div:nth-child(1) > div.box-body > img").attr("src")?.trim();
    await db.insert(CelebListTable).values({ title, avatar, url })
    revalidatePath("/people")
    return;
  }
  catch (e) {
    console.log(e)
  }
}
export async function getCelebs() {
  // don't include the ignoredList in it
  return await db.select().from(CelebListTable)
}

export async function getCelebInfo(id: number) {
  if (!id) return
  const [celeb] = await db.select().from(CelebListTable).where(eq(CelebListTable.id, id)).limit(1);
  return celeb;
}

export async function extractRealTimeWorkInfo(url: string): Promise<{data:Record<string, Film[]>, info:{nationality:string, gender:string, age:string}}> {
  const store: Record<string, Film[]> = {}
  const result = await fetch(url)
  const response = await result.text()
  const content = cheerio.load(response)
  // const name = content("#content > div > div.container-fluid > div > div.col-lg-4.col-md-4 > div > div:nth-child(1) > div.box-header.p-b-0.text-center > h1").text()
  // const avatar = content("#content > div > div.container-fluid > div > div.col-lg-4.col-md-4 > div > div:nth-child(1) > div.box-body > img").attr("src")
  const nationality = content("#content > div > div.container-fluid > div > div.col-lg-4.col-md-4 > div > div.box.clear.hidden-sm-down > div.box-body.light-b > ul > li:nth-child(5)").text().trim();
  const gender = content("#content > div > div.container-fluid > div > div.col-lg-4.col-md-4 > div > div.box.clear.hidden-sm-down > div.box-body.light-b > ul > li:nth-child(6)").text().trim();
  const age = content("#content > div > div.container-fluid > div > div.col-lg-4.col-md-4 > div > div.box.clear.hidden-sm-down > div.box-body.light-b > ul > li:nth-child(8)").text().trim();
  console.log(nationality, gender, age)
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
      if (children.length === 4) {
        const year = content(children[0]).text().trim();
        const title = content(children[1]).find("a").text().trim();
        //  console.log(title)
        const link = content(children[1]).find("a").attr("href");
        const role = content(children[2]).text().trim();
        const rating = content(children[3]).text().trim();
        crate.push({ year, title, link, episodes: "1", role, rating })
      }
      else if (children.length === 5) {
        const year = content(children[0]).text().trim();
        const title = content(children[1]).find("a").html() || "Unknown";
        const link = content(children[1]).find("a").attr("href");
        const episodes = content(children[2]).text().trim();
        const role = content(children[3]).text().trim();
        const rating = content(children[4]).text().trim();
        crate.push({ year, title, link, episodes, role, rating })
      }
      else {
        // don't know what to do with this
      }
    })
    store[header] = crate
    // use the header as key of object and store the table as named indexed, the entire table as the content like this
    // { [header]: content }
  })
  return {data:store,info:{nationality,gender,age}};
}

export async function addWorkInIgnoredList(id: number, title: string) {
  try {
    const session = await auth();
    if(session?.user?.role !== "ADMIN") return false;
    if(!id || !title) return false;
    const [data] = await db.select({ ignoredTitles: CelebListTable.ignoredTitles }).from(CelebListTable).where(eq(CelebListTable.id, id)).limit(1);
    if (!data) return false;
    const list = data?.ignoredTitles;
    if (!list) return false;
    if (list.includes(title)) return false;
    list.push(title);
    await db.update(CelebListTable).set({ ignoredTitles: list }).where(eq(CelebListTable.id, id));
    return true;
  }
  catch (error) {
    console.log(error)
    return false;
  }
}

export async function addWorkInFavouritedList(id: number, title: string) {
  try {
    const session = await auth();
    if(session?.user?.role !== "ADMIN") return false;
    if(!id || !title) return false;
    const [data] = await db.select({ favouritedTitles: CelebListTable.favouritedTitles }).from(CelebListTable).where(eq(CelebListTable.id, id)).limit(1);
    if (!data) return false;
    const list = data?.favouritedTitles;
    if (!list) return false;
    if (list.includes(title)) return false;
    list.push(title);
    await db.update(CelebListTable).set({ favouritedTitles: list }).where(eq(CelebListTable.id, id));
    return true;
  }
  catch (error) {
    console.log(error)
    return false;
  }
}

interface Film {
  year: string;
  title: string;
  link: string | undefined;
  episodes: string;
  role: string;
  rating: string;
}
