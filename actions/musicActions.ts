"use server"
import { db } from "@/lib/database";
import { MusicTable } from "@/lib/database/musicSchema";
import { NewMusic, Music } from "@/lib/database/musicSchema";
import { asc, eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function addMusic(music: NewMusic) {
    try {
        await db.insert(MusicTable).values(music);
        return { success: true }
    }
    catch (err) {
        console.log(err)
        return { success: false }
    }
}
export async function getMusic() {
    try {
        const music = await db.select().from(MusicTable).orderBy(asc(MusicTable.id));
        return { success: true, music }
    }
    catch (err) {
        console.log(err)
        return { success: false }
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