import React from "react";

interface ChatAreaProps {
    textRef: React.RefObject<HTMLTextAreaElement | null>;
    fontSize: string;
}

export function ChatArea({ textRef, fontSize }: ChatAreaProps) {
    return (
        <textarea
            id="chat"
            ref={textRef}
            style={{ fontSize }}
            className="w-full h-[72dvh] text-wrap prose prose-invert prose-neutral bg-gray-950
            flex-1 border border-neutral-400 rounded-xl overflow-y-auto max-w-3xl 
            mx-auto p-4 leading-relaxed text-neutral-300 font-serif"
        />
    );
}
