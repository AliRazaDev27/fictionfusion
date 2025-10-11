"use client";
import "./styles.css";
import { models, systems } from "@/lib/ai";
import { generateMessage, streamMessage } from "@/actions/chatActions";
import { Textarea } from "@/components/ui/textarea";
import { useRef } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function Page() {
    const modelRef = useRef<string>('gemini-2.5-flash');
    const systemRef = useRef<string>('storygen');
    const tempRef = useRef<number>(0.5);
    const textcontent = useRef<HTMLTextAreaElement>(null);
    const handleSend = async (message: string) => {
        if (!message) return
        const start = performance.now();
        console.log(message)
        const { output, success } = await generateMessage(message.trim(), modelRef.current, systemRef.current, tempRef.current);
        if (!success || !output) return;
        console.log("response time", (performance.now() - start) / 1000);

        if (textcontent.current) {
            textcontent.current.value = `${textcontent.current.value}${output.trim()}`
        }
    }
    const handleNext = async () => {
        if (!textcontent.current || !textcontent.current.value) return;
        const message = `Given this context: \n ${textcontent.current.value} \n
        Continue this in the same tone, rhythm, and style as before. 
        Do not change the writing form. 
        Generate the next part, which should maintain the continuity and progress it further.
        Do not deviate too much.
        Only return the new response.
        `;
        const start = performance.now();

        const { output, success } = await generateMessage(message, modelRef.current, systemRef.current, tempRef.current);
        if (!success || !output) return;
        console.log("response time", (performance.now() - start) / 1000);
        if (textcontent.current) {
            textcontent.current.value = `${textcontent.current.value}\n\n${output.trim()}`;
        }
    }
    const handleReGen = async () => {
        if (textcontent.current && textcontent.current.value) {
            const contentArray = textcontent.current.value.split("\n\n");
            console.log(contentArray)
            const contentSlice = contentArray.slice(0, -1);
            console.log(contentSlice)
            const contentJoin = contentSlice.join("\n\n");
            console.log(contentJoin)
            textcontent.current.value = contentJoin;
            handleNext();
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
                <div className="flex items-center justify-between pb-2">
                    {/* MODEL SELECTION */}
                    <Select onValueChange={(e) => { modelRef.current = e }}>
                        <SelectTrigger className="w-fit bg-gray-700">
                            <SelectValue placeholder="Models" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 text-slate-400">
                            {
                                models.map((model) => (
                                    <SelectItem key={model.model} value={model.model}>{model.name}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                    {/* SYSTEM SELECTION */}
                    <Select onValueChange={(e) => { systemRef.current = e }}>
                        <SelectTrigger className="w-fit bg-gray-700">
                            <SelectValue placeholder="Systems" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 text-slate-400">
                            {
                                Object.entries(systems).map(([key, value]) => (
                                    <SelectItem key={key} value={key}>{key.toUpperCase()}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>

                    <Select onValueChange={(e) => { tempRef.current = Number(e) }}>
                        <SelectTrigger className="w-fit bg-gray-700">
                            <SelectValue placeholder="Temp" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 text-slate-400">
                            <SelectItem value="0.3">🧊 Low (Consistent & Focused)</SelectItem>
                            <SelectItem value="0.7">🌤️ Medium (Balanced & Creative)</SelectItem>
                            <SelectItem value="1.0">🔥 High (Imaginative & Expressive)</SelectItem>
                            <SelectItem value="1.5">⚡ Wild (Unpredictable & Experimental)</SelectItem>
                        </SelectContent>
                    </Select>
                    {/* TEMP SELECTION */}
                    <button className="bg-gray-700 p-2 rounded-md cursor-pointer" onClick={handleReGen}>ReGen</button>
                    <button className="bg-gray-700 p-2 rounded-md cursor-pointer" onClick={handleNext}>Next</button>
                </div>
                <Textarea
                    className="p-2 md:p-4 md:text-lg outline-0 bg-gray-800  text-gray-300"
                    placeholder="Describe your story..."
                    // on enter send
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && e.shiftKey === false) {
                            e.preventDefault();
                            handleSend(e.currentTarget.value);
                        }
                    }}
                />
            </div>
        </div>
    );
}