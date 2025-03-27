"use server"
import { auth } from "@/auth"
import { db } from "@/lib/database";
import { IgnoneListTable } from "@/lib/database/ignorelistSchema";
import { eq } from "drizzle-orm";

const ignoreListCache = new Map<string, { data: any, expiry: number }>();

export async function addItemToIgnoreList(title:string){
    try{
        const session:any = await auth()
        const role = session?.user?.role || "VISITOR";
        if(role === "VISITOR") throw new Error("Not Authorized")
        const email = session?.user?.email    
        const exists = await db.select().from(IgnoneListTable).where(eq(IgnoneListTable.email,email)).limit(1)
        if(exists[0].items?.includes(title)) throw new Error("Item already in Ignore list")
        const updatedItems = exists[0].items ? [...exists[0].items,title] : [title]
        await db.update(IgnoneListTable).set({items:updatedItems}).where(eq(IgnoneListTable.email,email))
        if(exists.length === 0) throw new Error("No Ignore List Found For This User...")
        return {success:true}
    }
    catch(err:any){
        console.log(err)
        return {success:false,message:err?.message}
    }
}
export async function getIgnoreList(){
    try{
        const session:any = await auth()
        const role = session?.user?.role || "VISITOR";
        if(role === "VISITOR") throw new Error("Not Authorized")
        const email = session?.user?.email
        const cacheEntry = ignoreListCache.get(session?.user?.email);
        if (cacheEntry && cacheEntry.expiry > Date.now()) {
            return {success:true,items:cacheEntry.data};
        }
        const exists = await db.select().from(IgnoneListTable).where(eq(IgnoneListTable.email,email)).limit(1)
        if(exists.length === 0) throw new Error("No Ignore List Found For This User...")
        ignoreListCache.set(session?.user?.email, { data: exists[0].items, expiry: Date.now() + 15 * 60 * 1000 });
        return {success:true,items:exists[0].items}
    }
    catch(err:any){
        console.log(err)
        return {success:false,message:err?.message}
    }
}