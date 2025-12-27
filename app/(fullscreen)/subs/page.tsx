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
        // download result as a sub.srt file
        const blob = new Blob([result], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sub.srt';
        document.body.appendChild(a);
        a.click();
        // document.body.removeChild(a);
        // URL.revokeObjectURL(url);
    }
    return (
        <div className=" p-4 text-white text-2xl">
            <input ref={fileRef} type="file" accept="audio/*" />
            <button onClick={handleTranscribe}>Transcribe</button>
            <pre className="overflow-y-auto w-full">
                {result}
            </pre>
        </div>
    )
}