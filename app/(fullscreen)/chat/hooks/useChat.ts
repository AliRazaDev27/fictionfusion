"use client";

import { useRef, useState, useEffect } from "react";
import { generateMessage, summarizeContent } from "@/actions/chatActions";
import { useToast } from "@/components/ui/use-toast";

const CONTEXT_THRESHOLD = 16000;
const RECENT_WINDOW = 8000;

export function useChat() {
    const modelRef = useRef<string>('llama-3.3-70b-versatile');
    const systemRef = useRef<string>('storygen');
    const textcontentRef = useRef<HTMLTextAreaElement>(null);
    const queryRef = useRef<HTMLTextAreaElement>(null);
    const [disabled, setDisabled] = useState(false);
    const [totalTokens, setTotalTokens] = useState(0);
    const [fontSize, setFontSize] = useState('16px');
    const { toast } = useToast();

    useEffect(() => {
        if (typeof window !== "undefined" && window.localStorage) {
            const content = window.localStorage.getItem("chat") || "";
            if (textcontentRef.current) {
                textcontentRef.current.value = content;
            }
        }
    }, []);

    const buildContext = async (fullText: string) => {
        if (fullText.length <= CONTEXT_THRESHOLD) {
            return fullText;
        }

        const olderContent = fullText.slice(0, -RECENT_WINDOW);
        const recentContent = fullText.slice(-RECENT_WINDOW);

        const { summary, success } = await summarizeContent(olderContent);

        if (!success || !summary) {
            return recentContent;
        }

        return `[Story Summary]\n${summary}\n\n[Recent Events]\n${recentContent}`;
    };

    const handleSend = async (message: string) => {
        if (!message) return;
        const start = performance.now();
        setDisabled(true);

        const { output, success, message: msg, usage } = await generateMessage(
            message.trim(),
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

        const { output, success, message: msg, usage } = await generateMessage(
            context,
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
        } else {
            const tokens = usage?.totalTokens ? ` (${usage.totalTokens} tokens)` : '';
            toast({
                title: "Success",
                description: `Took ${Math.round(end)}s${tokens}`,
                duration: 1500,
            });
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
        handleGen,
        handleReGen,
        clearChat
    };
}
