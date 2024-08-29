"use server"
import { db } from "@/lib/database";
import { UserListTable } from "@/lib/database/userListTable";
import { ListTable } from "@/lib/database/listSchema";
import { eq, inArray } from "drizzle-orm";
import { auth } from "@/auth";
import { deleteList } from "./listActions";


export async function getMovieList(){
    const session:any = await auth();
    const role = session?.user?.role || "VISITOR";
    if(role === "VISITOR") return
    const result = await db.select({movieLists:UserListTable.movieLists}).from(UserListTable).where(eq(UserListTable.email,session?.user?.email)).limit(1)
    if(result.length === 0) return
    const values = result[0].movieLists
    if(!values || values.length === 0) return
    const data = await db.select().from(ListTable).where(inArray(ListTable.id,values))
    return data
}

export async function getShowList(){
    const session:any = await auth();
    const role = session?.user?.role || "VISITOR";
    if(role === "VISITOR") return
    const result = await db.select({showLists:UserListTable.showLists}).from(UserListTable).where(eq(UserListTable.email,session?.user?.email)).limit(1)
    if(result.length === 0) return
    const values = result[0].showLists
    if(!values || values.length === 0) return
    const data = await db.select().from(ListTable).where(inArray(ListTable.id,values))
    return data
}

export async function getBookList(){
    const session:any = await auth();
    const role = session?.user?.role || "VISITOR";
    if(role === "VISITOR") return
    const result = await db.select({bookLists:UserListTable.bookLists}).from(UserListTable).where(eq(UserListTable.email,session?.user?.email)).limit(1)
    if(result.length === 0) return
    const values = result[0].bookLists
    if(!values || values.length === 0) return
    const data = await db.select().from(ListTable).where(inArray(ListTable.id,values))
    return data
}
export async function deleteListFromUserList(listId:number,type:string,path:string){
    try{
     const session:any = await auth();
     const role = session?.user?.role || "VISITOR";
     if(role === "VISITOR") throw new Error("Not Authorized")
     const isDeleted = await deleteList(listId,path)
     if(!isDeleted.success) throw new Error(isDeleted?.message)
     if(type === "movie"){
        const userList = await db.select({movieLists:UserListTable.movieLists}).from(UserListTable).where(eq(UserListTable.email,session?.user?.email)).limit(1)
        const values = userList[0].movieLists
        if(!values || values.length === 0) throw new Error("No lists found/Empty List")
        const newValues = values.filter((value) => value !== listId)
        await db.update(UserListTable).set({movieLists:newValues}).where(eq(UserListTable.email,session?.user?.email))
     }
    
     if(type === "show"){
        const userList = await db.select({showLists:UserListTable.showLists}).from(UserListTable).where(eq(UserListTable.email,session?.user?.email)).limit(1)
        const values = userList[0].showLists
        if(!values || values.length === 0) throw new Error("No lists found/Empty List")
        const newValues = values.filter((value) => value !== listId)
        await db.update(UserListTable).set({showLists:newValues}).where(eq(UserListTable.email,session?.user?.email))
     }
     if(type === "book"){
        const userList = await db.select({bookLists:UserListTable.bookLists}).from(UserListTable).where(eq(UserListTable.email,session?.user?.email)).limit(1)
        const values = userList[0].bookLists
        if(!values || values.length === 0) throw new Error("No lists found/Empty List")
        const newValues = values.filter((value) => value !== listId)
        await db.update(UserListTable).set({bookLists:newValues}).where(eq(UserListTable.email,session?.user?.email))
     }
     return {success:true}
    } 
    catch(err:any){
        console.log(err)
        return {success:false,message:err?.message}
    }
    
}