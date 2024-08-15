"use client"
import { loadBooks } from "@/actions";

export default function Loader() {
    const result = async()=>{
        console.log("loading")
        await loadBooks()
    }
    return <button onClick={()=>result()}>Load</button>;
}