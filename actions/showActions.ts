"use server"
import { addShowTODatabase, deleteShow, getShows } from "@/lib/database/showSchema";
import { Show } from "@/types";
import { revalidatePath } from "next/cache";


export async function getShowInfo(showID: string) {
    // https://api.tvmaze.com/shows/:id
    const result = await fetch(`https://api.tvmaze.com/shows/${showID}`);
    const response = await result.json();
    return response;
}
export async function searchShowByTitle(title: string) {
    // https://api.tvmaze.com/search/shows?q=:title
    const result = await fetch(`https://api.tvmaze.com/search/shows?q=${title}`);
    const response = await result.json();
    return response;
}
export async function addShow(show: Show) {
    const result = await addShowTODatabase(show);
    if(result.success){
        revalidatePath("/shows")
    }
    return result
}
export async function getAllShows() {
    const result = await getShows();
    return result
}
export async function deleteShowByID(id: number) {
    const result = await deleteShow(id);
    if(result.success){
        revalidatePath("/shows")
    }
    return result
}