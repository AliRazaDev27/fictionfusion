"use client";
import "./styles.css";
import { models_groq, systems } from "@/lib/ai";
import { generateMessage, summarizeContent } from "@/actions/chatActions";
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
    const [totalTokens, setTotalTokens] = useState(0);
    const { toast } = useToast();
    const handleSend = async (message: string) => {
        if (!message) return
        const start = performance.now();
        console.log('[handleSend] Starting with message:', message);
        setDisabled(true);
        const { output, success, message: msg, usage } = await generateMessage(message.trim(), modelRef.current, systemRef.current, tempRef.current);
        setDisabled(false);
        if (usage?.totalTokens) {
            setTotalTokens(prev => prev + usage?.totalTokens!);
        }
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
    // Context building with automatic summarization for token optimization
    const CONTEXT_THRESHOLD = 8000; // chars (~2000 words)
    const RECENT_WINDOW = 4000;     // Keep last ~1000 words verbatim

    const buildContext = async (fullText: string) => {
        if (fullText.length <= CONTEXT_THRESHOLD) {
            console.log('[buildContext] Content short enough, using as-is:', fullText.length, 'chars');
            return fullText;
        }

        console.log('[buildContext] Content exceeds threshold, summarizing older portion');
        const olderContent = fullText.slice(0, -RECENT_WINDOW);
        const recentContent = fullText.slice(-RECENT_WINDOW);

        const { summary, success } = await summarizeContent(olderContent);

        if (!success || !summary) {
            console.warn('[buildContext] Summarization failed, using truncated context');
            return recentContent;
        }

        console.log('[buildContext] Summary created:', summary.length, 'chars from', olderContent.length, 'chars');
        return `[Story Summary]\n${summary}\n\n[Recent Events]\n${recentContent}`;
    };

    const handleNext = async () => {
        if (!textcontent.current || !textcontent.current.value) return;
        const start = performance.now();

        console.log('[handleNext] Building optimized context');
        setDisabled(true);

        // Build token-optimized context
        const context = await buildContext(textcontent.current.value);
        console.log('[handleNext] Context ready, length:', context.length, 'chars');

        // Use storygen_continue system prompt - instructions are in system, not message
        const { output, success, message: msg, usage } = await generateMessage(
            context,
            modelRef.current,
            'storygen_continue', // Use continuation-specific system prompt
            tempRef.current
        );
        const end = ((performance.now() - start) / 1000);
        setDisabled(false);
        if (usage?.totalTokens) {
            setTotalTokens(prev => prev + usage?.totalTokens!);
        }
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
            const tokens = usage?.totalTokens ? ` (${usage.totalTokens} tokens)` : '';
            console.log('[handleNext] Success, output length:', output.length, 'tokens:', usage);
            toast({
                title: "Success",
                description: `Took ${Math.round(end)}s${tokens}`,
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
                            <div className="mt-4 pt-4 border-t border-gray-700 w-full">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-400">Total Tokens Used:</span>
                                    <span className="font-mono text-lg text-cyan-400">{totalTokens.toLocaleString()}</span>
                                </div>
                                <button
                                    onClick={() => setTotalTokens(0)}
                                    className="mt-2 text-xs text-gray-500 hover:text-gray-300 cursor-pointer"
                                >
                                    Reset counter
                                </button>
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
