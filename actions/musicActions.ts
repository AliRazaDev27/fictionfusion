"use server"
import { db } from "@/lib/database";
import { MusicTable } from "@/lib/database/musicSchema";
import { NewMusic,Music } from "@/lib/database/musicSchema";
import { eq } from "drizzle-orm";

export async function addMusic(music: NewMusic) {
    try{
    await db.insert(MusicTable).values(music);
    return {success: true}
    }
    catch(err){
        console.log(err)
        return {success: false}
    }
}
export async function getMusic() {
    try{
    const music = await db.select().from(MusicTable);
    return {success: true, music}
    }
    catch(err){
        console.log(err)
        return {success: false}
    }
}
export async function updateMusicCoverArt(id: number, coverArt: string) {
    try{
    await db.update(MusicTable).set({coverArt: coverArt}).where(eq(MusicTable.id, id));
    return {success: true}
    }
    catch(err){
        console.log(err)
        return {success: false}
    }
}