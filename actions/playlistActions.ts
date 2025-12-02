"use server"
import { db } from "@/lib/database";
import { auth } from "@/auth";
import { ListTable } from "@/lib/database/listSchema";
import { UserListTable } from "@/lib/database/userListTable";
import { eq, inArray } from "drizzle-orm";

export async function createPlaylist(title: string) {
    try{
        const session:any = await auth()
        const role = session?.user?.role || "VISITOR";
        if(role === "VISITOR") throw new Error("Not Authorized")
        const list = await db.insert(ListTable).values({listName:title,creator:session?.user?.email,type:"musiclist"}).returning()
        const exists = await db.select().from(UserListTable).where(eq(UserListTable.email,session?.user?.email)).limit(1)
        if(exists.length === 0){
            await db.insert(UserListTable).values({email:session?.user?.email,musicLists:[list[0].id],bookLists:[],movieLists:[],showLists:[]})
        }
        else{
            if(exists[0].musicLists){
                await db.update(UserListTable).set({musicLists:[...exists[0].musicLists,list[0].id]}).where(eq(UserListTable.email,session?.user?.email))
            }
            else{
                await db.update(UserListTable).set({musicLists:[list[0].id]}).where(eq(UserListTable.email,session?.user?.email))
            }
        }
        return {success:true,list:list[0]}
    }catch(err:any){
        console.log(err)
        return {success:false,message:err?.message}
    }
}
export async function getAllMusicPlaylists(){
    "use cache"
    try{
        const email = "alirazadev27@gmail.com"
        const userLists = await db.select({musicLists:UserListTable.musicLists}).from(UserListTable).where(eq(UserListTable.email,email)).limit(1)
        const values = userLists[0].musicLists
        if(!values || values.length === 0) throw new Error("No lists found/Empty List")
        const lists = await db.select().from(ListTable).where(inArray(ListTable.id,values))
        return {success:true,lists:lists}
    }catch(err:any){
            console.log(err)
            return {success:false,message:err?.message,lists:[]}
        }

}
export async function addToPlaylist(playlistID:number,musicList:number[]){
    try{
        const session:any = await auth()
        const role = session?.user?.role || "VISITOR";
        if(role === "VISITOR") throw new Error("Not Authorized")
        const exists = await db.select().from(ListTable).where(eq(ListTable.id,playlistID)).limit(1)
        const items = exists[0].items
        if(!items) throw new Error("List not Found")
        const updatedItems = [...new Set([...items,...musicList])]
        await db.update(ListTable).set({items:updatedItems}).where(eq(ListTable.id,playlistID))
        return {success:true,items:updatedItems}    
    }
    catch(err:any){
        console.log(err)
        return {success:false,message:err?.message}
    }
}

export async function removeFromPlaylist(playlistID:number,musicList:number[]){
    try{
        const session:any = await auth()
        const role = session?.user?.role || "VISITOR";
        if(role === "VISITOR") throw new Error("Not Authorized")
        const exists = await db.select().from(ListTable).where(eq(ListTable.id,playlistID)).limit(1)
        const items = exists[0].items
        if(!items) throw new Error("List not Found")
        const updatedItems = items.filter((item:number) => !musicList.includes(item))
        await db.update(ListTable).set({items:updatedItems}).where(eq(ListTable.id,playlistID))
        return {success:true,items:updatedItems}

    }
    catch(err:any){
        console.log(err)
        return {success:false,message:err?.message}
    }
    
}