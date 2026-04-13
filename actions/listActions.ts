"use server"
import { auth } from "@/auth"
import { db } from "@/lib/database";
import { ListTable } from "@/lib/database/listSchema";
import { UserListTable } from "@/lib/database/userListTable";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
// import { getBooksFromArrayList } from "./bookActions";
import { getShowsFromArrayList } from "./showActions";
import { getMoviesFromArrayList } from "./movieActions";
export async function CreateList(name:string|null,type:string|null){
    try{
        const session:any = await auth()
    const role = session?.user?.role || "VISITOR";
    if(role === "VISITOR") throw new Error("Not Authorized")
    if(name === "" || name === null) throw new Error("List name cannot be empty")
    if(type === "" || type === null) throw new Error("List type cannot be empty")
    // add check to see if user already has a list with given name and type.
    const result = await db.insert(ListTable).values({listName:name,creator:session?.user?.name,type: type}).returning()
    const exists = await db.select().from(UserListTable).where(eq(UserListTable.email,session?.user?.email)).limit(1)
    if(exists.length === 0){
        await db.insert(UserListTable).values({email:session?.user?.email,bookLists:[],movieLists:[],showLists:[]})
        if(type==="book"){
            await db.update(UserListTable).set({bookLists:[result[0].id]}).where(eq(UserListTable.email,session?.user?.email))
        }
        if(type==="movie"){
            await db.update(UserListTable).set({movieLists:[result[0].id]}).where(eq(UserListTable.email,session?.user?.email))
        }
        if(type==="show"){
            await db.update(UserListTable).set({showLists:[result[0].id]}).where(eq(UserListTable.email,session?.user?.email))
        }
    }
    else{
        if(type==="book"){
            if(exists[0].bookLists){
                await db.update(UserListTable).set({bookLists:[...exists[0].bookLists,result[0].id]}).where(eq(UserListTable.email,session?.user?.email))
            }
            else{
                await db.update(UserListTable).set({bookLists:[result[0].id]}).where(eq(UserListTable.email,session?.user?.email))
            }
        }
        if(type==="movie"){
            if(exists[0].movieLists){
                await db.update(UserListTable).set({movieLists:[...exists[0].movieLists,result[0].id]}).where(eq(UserListTable.email,session?.user?.email))
            }
            else{
                await db.update(UserListTable).set({movieLists:[result[0].id]}).where(eq(UserListTable.email,session?.user?.email))
            }
        }
        if(type==="show"){
            if(exists[0].showLists){
                await db.update(UserListTable).set({showLists:[...exists[0].showLists,result[0].id]}).where(eq(UserListTable.email,session?.user?.email))
            }
            else{
                await db.update(UserListTable).set({showLists:[result[0].id]}).where(eq(UserListTable.email,session?.user?.email))
            }
        }
    }
    return {success:true}

    }
    catch(err:any){
        console.log(err)
        return {success:false,message:err?.message}
    }

}

export async function addItemToList(listId:number,itemId:number){
    try{
        const exists = await db.select().from(ListTable).where(eq(ListTable.id,listId)).limit(1)
        if(exists[0].items?.includes(itemId)) throw new Error("Item already in list")
        const updatedItems = exists[0].items ? [...exists[0].items,itemId] : [itemId]
        await db.update(ListTable).set({items:updatedItems}).where(eq(ListTable.id,listId))
        return {success:true}
    }
    catch(err:any){
        console.log(err)
        return {success:false,message:err?.message}
    }
}
export async function updateListName(listId:number,name:string,path:string){
    try{
        const session:any = await auth()
    const role = session?.user?.role || "VISITOR";
    if(role === "VISITOR") throw new Error("Not Authorized")
    else if(role === "ADMIN"){
        await db.update(ListTable).set({listName:name}).where(eq(ListTable.id,listId))
    }
    else{
        const exists = await db.select().from(ListTable).where(eq(ListTable.id,listId)).limit(1)
        if(exists[0].creator !== session?.user?.name) throw new Error("Not Authorized")
        await db.update(ListTable).set({listName:name}).where(eq(ListTable.id,listId))    
    }
    revalidatePath(`/dashboard/${path}`)
    return {success:true}
    }
    catch(err:any){
        console.log(err)
        return {success:false,message:err?.message}
    }
}
export async function deleteList(listId:number,path:string){
    try{
        const session:any = await auth()
    const role = session?.user?.role || "VISITOR";
    if(role === "VISITOR") throw new Error("Not Authorized")
    else if(role === "ADMIN"){
        await db.delete(ListTable).where(eq(ListTable.id,listId))
    }
    else{
        const exists = await db.select().from(ListTable).where(eq(ListTable.id,listId)).limit(1)
        if(exists[0].creator !== session?.user?.name) throw new Error("Not Authorized")
        await db.delete(ListTable).where(eq(ListTable.id,listId))    
    }
    revalidatePath(`/dashboard/${path}`)
    return {success:true}
    }
    catch(err:any){
        console.log(err)
        return {success:false,message:err?.message}
    }
}
export async function getListItems(listId:number) {
    try{
        const session:any = await auth()
        const role = session?.user?.role || "VISITOR";
        if(role === "VISITOR") throw new Error("Not Authorized")
        const list = await db.select().from(ListTable).where(eq(ListTable.id,listId)).limit(1)
        if(list[0].creator !== session?.user?.name) throw new Error("Not Authorized") 
        const {items,type} = list[0] 
        if(!items || items.length === 0) throw new Error("List not Found / Empty List")
        // create a getItemsByArray function for each type
        // if(type==="book"){
        //     const result = await getBooksFromArrayList(items)
        //     return {result:result,type:type}
        // }
        if(type==="movie"){
            const result = await getMoviesFromArrayList(items)
            return {result:result,type:type}
        }
        if(type==="show"){
            const result = await getShowsFromArrayList(items)
            return {result:result,type:type}
        }
    }
    catch(err:any){
        console.log(err)
    }
}