"use server"
import { db } from "@/lib/database";
import { UserListTable } from "@/lib/database/userListTable";
import { ListTable } from "@/lib/database/listSchema";
import { eq, inArray } from "drizzle-orm";
import { auth } from "@/auth";


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