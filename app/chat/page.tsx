"use client";
import "./styles.css";
import { streamMessage } from "@/actions/chatActions";
import { Input } from "@/components/ui/input";
import { useState, Suspense, useRef } from "react";
import { readStreamableValue } from '@ai-sdk/rsc';

export const maxDuration = 30;
export default function Page() {
    const generation  = useRef<string>('');
    const textcontent = useRef<HTMLTextAreaElement>(null);
    const handleSend = async (message: string) => {
        const start = performance.now();
        console.log(message)
        const { output,success } = await streamMessage(message, "gemini-2.5-flash");
        if(!success || !output) return;
        for await (const delta of readStreamableValue(output)) {
        console.log("response time", (performance.now() - start) / 1000);
            generation.current = `${generation.current}${delta}`;
            if (textcontent.current) {
                textcontent.current.value = generation.current;
            }
        }

    }
    return (
        <div className="flex flex-col gap-2 w-full p-2 min-h-[calc(100vh-70px)] bg-gray-900 text-white/90">
                <textarea id='chat' ref={textcontent}
                 className="w-full h-[72dvh] text-lg  text-wrap prose prose-invert prose-neutral bg-gray-950
            flex-1 border border-neutral-400 rounded-xl overflow-y-auto max-w-3xl 
            mx-auto p-4 leading-relaxed text-[20px] text-neutral-300 font-serif">
                </textarea>
            <div className="mt-auto max-w-3xl mx-auto w-full">
                <Input
                    className="p-3 md:p-6 md:text-xl  text-black"
                    placeholder="Type something..."
                    // on enter send
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSend(e.currentTarget.value);
                            e.currentTarget.value = "";
                        }
                    }}
                ></Input>
            </div>
        </div>
    );
}