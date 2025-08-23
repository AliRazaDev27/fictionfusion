"use server"
import { db } from "@/lib/database";
import { MusicTable } from "@/lib/database/musicSchema";
import { NewMusic } from "@/lib/database/musicSchema";
import {  desc, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { deleteMusicFileOnCloudinary } from "@/lib/cloudinaryHelper";
import { revalidatePath } from "next/cache";

export async function revalidateMusic() {
    revalidatePath("/music");
}
export async function addMusic(music: NewMusic) {
    try {
        const session: any = await auth();
        if (session?.user?.role !== "ADMIN") throw new Error("Not Authorized")
        await db.insert(MusicTable).values(music);
        // revalidatePath("/music")
        return { success: true, message: "Music added successfully", music }
    }
    catch (err:any) {
        console.log(err)
        return { success: false, message: err.message, music: null }
    }
}
export async function getMusic(offset: number = 0, limit: number = 16) {
    try {
        const music = await db.select().from(MusicTable)
            .orderBy(desc(MusicTable.modifiedDate))
            .offset(offset)
            .limit(limit);
        const totalMusicCount = await db.select({ count: MusicTable.id }).from(MusicTable);
        return { success: true, music, totalCount: totalMusicCount.length }
    }
    catch (err:any) {
        console.log(err.message)
        return { success: false, music: [], totalCount: 0 }
    }
}
export async function updateMusicCoverArt(id: number, coverArt: string) {
    try {
        await db.update(MusicTable).set({ coverArt: coverArt }).where(eq(MusicTable.id, id));
        return { success: true }
    }
    catch (err) {
        console.log(err)
        return { success: false }
    }
}
export async function updateMusicMetadata(id: number, metadata: { artistName: string, artworkUrl100: string, collectionName: string, releaseDate: string, trackName: string, trackTimeMillis: number }) {
    try {
        const session: any = await auth();
        if (session.user.role !== "ADMIN") throw new Error("Not Authorized")
            const minutesInFloatPoint = (metadata.trackTimeMillis / 1000) / 60 
            const minutesInInteger = Math.floor(minutesInFloatPoint)
            const seconds = (minutesInFloatPoint - minutesInInteger) * 60
            const duration = `${minutesInInteger}:${seconds.toString().padStart(2, "0")}`;

        const data = await db.update(MusicTable)
            .set(
                {
                    artist: metadata.artistName,
                    coverArt: metadata.artworkUrl100,
                    album: metadata.collectionName,
                    releaseDate: metadata.releaseDate,
                    title: metadata.trackName,
                    duration: duration,
                }
            )
            .where(eq(MusicTable.id, id)).returning();
        return { success: true, data }
    }
    catch (err: any) {
        return {
            message: err.message,
            success: false
        }
    }
}

export const deleteMusic = async (id: number) => {
    try {
        const session: any = await auth();
        if(!session) throw new Error("Please Sign In first...") 
        if (session?.user?.role !== "ADMIN") throw new Error("Not Authorized")
        const musicItem = await db.select().from(MusicTable).where(eq(MusicTable.id, id)).limit(1);
        const fileUrlPrivate = musicItem[0].fileUrlPrivate
        if(fileUrlPrivate){
        await deleteMusicFileOnCloudinary(fileUrlPrivate)
        }
        await db.delete(MusicTable).where(eq(MusicTable.id, id));
        return { success: true }
    }
    catch (err:any) {
        console.log(err)
        return { success: false, message: err.message }
    }
}
export const fetchLatestMusic = async () => {
    console.log("fetching latest music")
    try{
        const session: any = await auth();
        if(!session) throw new Error("Please Sign In first...") 
        if (session?.user?.role !== "ADMIN") throw new Error("Not Authorized")
        revalidatePath("/music")    
    }
    catch(err:any){
        console.log(err)
    }
}
