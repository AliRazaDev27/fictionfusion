"use client";
import { useRef, useState } from "react";
import { getSubs } from "./actions";
export default function page() {
    const fileRef = useRef<HTMLInputElement>(null);
    const [result, setResult] = useState<string | null>(null);
    const handleTranscribe = async () => {
        const file = fileRef.current?.files?.[0];
        if (!file) return;
        const result = await getSubs(file);
        setResult(result);
    }
    return (
        <div className=" p-4 text-white text-2xl">
            <input ref={fileRef} type="file" accept="audio/*" />
            <button onClick={handleTranscribe}>Transcribe</button>
            <div className="overflow-y-auto w-full">
                {result}
            </div>
        </div>
    )
}