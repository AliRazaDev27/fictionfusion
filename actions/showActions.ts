"use server"
import { addShowTODatabase, getShows } from "@/lib/database/showSchema";
import { Show } from "@/types";


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
    return result
}
export async function getAllShows() {
    const result = await getShows();
    return result
}