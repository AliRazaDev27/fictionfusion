"use client";
import "./styles.css";
import { models_groq, systems } from "@/lib/ai";
import { generateMessage } from "@/actions/chatActions";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { FaPlay } from "react-icons/fa";
import { IoReloadSharp } from "react-icons/io5";
import { IoSettings } from "react-icons/io5";
import { FaClipboard } from "react-icons/fa6";



export default function Page() {
    const modelRef = useRef<string>(models_groq[0].id);
    const systemRef = useRef<string>('storygen');
    const tempRef = useRef<number>(0.5);
    const textcontent = useRef<HTMLTextAreaElement>(null);
    const queryRef = useRef<HTMLTextAreaElement>(null);
    const [disabled, setDisabled] = useState(false);
    const { toast } = useToast();
    const handleSend = async (message: string) => {
        if (!message) return
        const start = performance.now();
        console.log('[handleSend] Starting with message:', message);
        setDisabled(true);
        const { output, success, message: msg } = await generateMessage(message.trim(), modelRef.current, systemRef.current, tempRef.current);
        setDisabled(false);
        const end = ((performance.now() - start) / 1000);
        console.log('[handleSend] Response received in', Math.round(end), 'seconds');
        if (!success || !output) {
            console.error('[handleSend] Error:', msg);
            toast({
                title: "Error",
                description: msg,
                variant: "destructive",
                duration: 2000,
            })
            return;
        }
        else {
            console.log('[handleSend] Success, output length:', output.length);
            toast({
                title: "Success",
                description: `Took ${Math.round(end)} seconds`,
                duration: 1500,
            })
        }
        if (textcontent.current) {
            textcontent.current.value = `${textcontent.current.value}${output.trim()}\n\n`
            window.localStorage.setItem("chat", textcontent.current.value);
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

        console.log('[handleNext] Making continuation request');
        setDisabled(true);
        const { output, success, message: msg } = await generateMessage(message, modelRef.current, systemRef.current, tempRef.current);
        const end = ((performance.now() - start) / 1000);
        setDisabled(false);
        console.log('[handleNext] Response received in', Math.round(end), 'seconds');
        if (!success || !output) {
            console.error('[handleNext] Error:', msg);
            toast({
                title: "Error",
                description: msg,
                variant: "destructive",
                duration: 2000,
            })
            return;
        }
        else {
            console.log('[handleNext] Success, output length:', output.length);
            toast({
                title: "Success",
                description: `Took ${Math.round(end)} seconds`,
                duration: 1500,
            })
        }

        if (textcontent.current) {
            textcontent.current.value = `${textcontent.current.value}${output.trim()}\n\n`;
            window.localStorage.setItem("chat", textcontent.current.value);
        }
    }

    const handleGen = async () => {
        if (textcontent.current) {
            if (textcontent.current.value) {
                console.log('next')
                handleNext();
            }
            else {
                console.log('send')
                handleSend(queryRef.current?.value.trim() || "");
            }
        }
    }
    const handleReGen = async () => {
        if (textcontent.current && textcontent.current.value) {
            const contentArray = textcontent.current.value.split("\n\n");
            console.log(contentArray)
            if (contentArray.at(-1) === '') contentArray.pop();
            const contentSlice = contentArray.slice(0, -1);
            console.log(contentSlice)
            const contentJoin = contentSlice.join("\n\n");
            console.log(contentJoin)
            textcontent.current.value = contentJoin;
            handleNext();
        }
    }

    useEffect(() => {
        console.log('starting');
        if (window.localStorage) {
            console.log('localstorage')
            if (textcontent.current) {
                console.log('textcontent')
                const content = window.localStorage.getItem("chat") || "";
                console.log(`content: ${content}`)
                textcontent.current.defaultValue = content;
            }
        }
    }, [])
    return (
        <div className="flex flex-col gap-2 w-full p-2 min-h-screen bg-gray-900 text-white/90">
            <textarea id='chat' ref={textcontent}
                className="w-full h-[72dvh] text-lg  text-wrap prose prose-invert prose-neutral bg-gray-950
            flex-1 border border-neutral-400 rounded-xl overflow-y-auto max-w-3xl 
            mx-auto p-4 leading-relaxed text-[20px] text-neutral-300 font-serif">
            </textarea>
            <div className="mt-auto max-w-3xl mx-auto w-full">
                <div className="w-full overflow-hidden flex items-center justify-evenly pb-2">
                    <Dialog>
                        <DialogTrigger className="bg-gray-700 px-4 py-2.5 rounded-md cursor-pointer">
                            <IoSettings />
                        </DialogTrigger>
                        <DialogContent className="bg-gray-950 text-gray-300">
                            <DialogHeader>
                                <DialogTitle>Settings</DialogTitle>
                                <DialogDescription className="sr-only">Choose a model, system, and temperature </DialogDescription>
                            </DialogHeader>
                            <div className="flex items-center justify-between w-full">
                                {/* MODEL SELECTION */}
                                <Select defaultValue={models_groq[0].id} onValueChange={(e) => { modelRef.current = e }}>
                                    <SelectTrigger className="w-fit bg-gray-700">
                                        <SelectValue placeholder="Models" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 text-slate-400">
                                        {
                                            models_groq.map((model) => (
                                                <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
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

                                {/* TEMP SELECTION */}
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


                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog>
                        <DialogTrigger className="bg-gray-700 px-4 py-2.5 rounded-md cursor-pointer"><FaClipboard /></DialogTrigger>
                        <DialogContent className="bg-gray-950 text-gray-300">
                            <DialogHeader>
                                <DialogTitle>Manage</DialogTitle>
                            </DialogHeader>
                            <div className="flex flex-col items-center gap-2">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <button className="bg-gray-700 p-2 rounded-md cursor-pointer">Clear</button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Clear Chat</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to clear the chat?
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => { textcontent.current!.value = ""; window.localStorage.removeItem("chat") }}>Clear</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Button className="bg-gray-700 px-4 py-2 rounded-md cursor-pointer" disabled={disabled} onClick={handleReGen}>
                        <IoReloadSharp />
                    </Button>
                    <Button className="bg-gray-700 px-4 py-2 rounded-md cursor-pointer" disabled={disabled} onClick={handleGen}>
                        <FaPlay />
                    </Button>
                </div>
                <Textarea
                    id="query"
                    ref={queryRef}
                    className="p-2 md:p-4 md:text-lg outline-0 bg-slate-950  text-gray-300"
                    placeholder="Describe your story..."
                />
            </div>
        </div>
    );
}
