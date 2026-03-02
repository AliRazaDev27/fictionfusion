import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
    queryRef: React.RefObject<HTMLTextAreaElement | null>;
}

export function ChatInput({ queryRef }: ChatInputProps) {
    return (
        <Textarea
            id="query"
            ref={queryRef}
            className="p-2 md:p-4 md:text-lg outline-0 bg-slate-950 text-gray-300"
            placeholder="Describe your story..."
        />
    );
}
