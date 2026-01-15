"use client";

import { useRef, useState, useEffect } from "react";
import { generateMessage, summarizeContent } from "@/actions/chatActions";
import { useToast } from "@/components/ui/use-toast";



export function useChat() {
    const modelRef = useRef<string>('llama-3.3-70b-versatile');
    const systemRef = useRef<string>('storygen');
    const textcontentRef = useRef<HTMLTextAreaElement>(null);
    const queryRef = useRef<HTMLTextAreaElement>(null);
    const summaryRef = useRef<string>('');
    const [disabled, setDisabled] = useState(false);
    const [totalTokens, setTotalTokens] = useState(0);
    const [fontSize, setFontSize] = useState('16px');
    const [paragraphs, setParagraphs] = useState(2);
    const { toast } = useToast();

    useEffect(() => {
        if (typeof window !== "undefined" && window.localStorage) {
            const content = window.localStorage.getItem("chat") || "";
            const summary = window.localStorage.getItem("chat_summary") || "";
            if (textcontentRef.current) {
                textcontentRef.current.value = content;
            }
            summaryRef.current = summary;
            console.log("[useChat] Initialized. Story length:", content.length, "Summary length:", summary.length);
        }
    }, []);

    const buildContext = async (fullText: string) => {
        const BUF_LIMIT = 8000; // Maximum prose to send
        console.log("[buildContext] Analysis started. total_chars:", fullText.length);

        if (fullText.length <= BUF_LIMIT) {
            console.log("[buildContext] Story is short. Sending full text.");
            return fullText;
        }

        const recentProse = fullText.slice(-BUF_LIMIT);

        // Check if we need to initialize or update Lore
        if (!summaryRef.current) {
            console.log("[buildContext] Lorebook missing. Generating initial Lorebook from previous parts using Compound model...");
            const olderPart = fullText.slice(0, -BUF_LIMIT);
            const { output, success } = await generateMessage(olderPart, 'groq/compound', 'storygen_extract_lore', 0.3);
            if (success && output) {
                summaryRef.current = output;
                window.localStorage.setItem("chat_summary", output);
                console.log("[buildContext] Initial Lorebook saved. Length:", output.length);
            }
        } else if (fullText.length > BUF_LIMIT * 2) {
            // Logic for incremental update could go here, but for now we prioritize using existing lore + window
            console.log("[buildContext] Using existing Lorebook + sliding window.");
        }

        console.log("[buildContext] Optimized context ready. Lore:", !!summaryRef.current, "RecentProse:", recentProse.length);
        return `[LOREBOOK]\n${summaryRef.current}\n\n[RECENT STORY]\n${recentProse}`;
    };

    const handleSend = async (message: string) => {
        if (!message) return;
        const start = performance.now();
        setDisabled(true);

        const instruction = `\n\n[Instruction: Write exactly ${paragraphs} paragraphs.]`;
        const { output, success, message: msg, usage } = await generateMessage(
            message.trim() + instruction,
            modelRef.current,
            systemRef.current,
        );

        setDisabled(false);

        const tokens = usage?.totalTokens;
        if (typeof tokens === "number") {
            setTotalTokens(prev => prev + tokens);
        }

        const end = (performance.now() - start) / 1000;

        if (!success || !output) {
            toast({
                title: "Error",
                description: msg,
                variant: "destructive",
                duration: 2000,
            });
            return;
        }

        if (textcontentRef.current) {
            textcontentRef.current.value = `${textcontentRef.current.value}${textcontentRef.current.value.endsWith('\n\n') || !textcontentRef.current.value ? '' : '\n\n'}${output.trim()}\n\n`;
            window.localStorage.setItem("chat", textcontentRef.current.value);

            if (queryRef.current) {
                queryRef.current.value = "";
            }
        }
    };

    const handleNext = async () => {
        if (!textcontentRef.current || !textcontentRef.current.value) return;
        const start = performance.now();
        setDisabled(true);

        const context = await buildContext(textcontentRef.current.value);

        const instruction = `\n\n[Instruction: Write exactly ${paragraphs} paragraphs.]`;
        const { output, success, message: msg, usage } = await generateMessage(
            context + instruction,
            modelRef.current,
            'storygen_continue',
        );

        const end = (performance.now() - start) / 1000;
        setDisabled(false);

        const tokens = usage?.totalTokens;
        if (typeof tokens === "number") {
            setTotalTokens(prev => prev + tokens);
        }

        if (!success || !output) {
            toast({
                title: "Error",
                description: msg,
                variant: "destructive",
                duration: 2000,
            });
            return;
        }
        if (textcontentRef.current) {
            textcontentRef.current.value = `${textcontentRef.current.value}${textcontentRef.current.value.endsWith('\n\n') || !textcontentRef.current.value ? '' : '\n\n'}${output.trim()}\n\n`;
            window.localStorage.setItem("chat", textcontentRef.current.value);
        }
    };

    const handleGen = async () => {
        if (textcontentRef.current) {
            if (textcontentRef.current.value) {
                handleNext();
            } else {
                handleSend(queryRef.current?.value.trim() || "");
            }
        }
    };

    const handleReGen = async () => {
        // TODO: rather than reGen, it would be much useful to delete last paragraph, with a 3 sec window to undo it.
        if (textcontentRef.current && textcontentRef.current.value) {
            const contentArray = textcontentRef.current.value.split("\n\n");
            if (contentArray.at(-1) === '') contentArray.pop();
            const contentSlice = contentArray.slice(0, -1);
            const contentJoin = contentSlice.join("\n\n");
            textcontentRef.current.value = contentJoin ? contentJoin + "\n\n" : "";
            handleNext();
        }
    };

    const clearChat = () => {
        if (textcontentRef.current) {
            textcontentRef.current.value = "";
            window.localStorage.removeItem("chat");
            window.localStorage.removeItem("chat_summary");
            summaryRef.current = "";
            console.log("[useChat] Chat and Lore cleared.");
        }
    };

    return {
        modelRef,
        systemRef,
        textcontentRef,
        queryRef,
        disabled,
        totalTokens,
        setTotalTokens,
        fontSize,
        setFontSize,
        paragraphs,
        setParagraphs,
        handleGen,
        handleReGen,
        clearChat
    };
}
