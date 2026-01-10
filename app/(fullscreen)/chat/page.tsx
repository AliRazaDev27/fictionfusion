"use client";

import "./styles.css";
import { useChat } from "./hooks/useChat";
import { ChatArea } from "./components/ChatArea";
import { SettingsDialog } from "./components/SettingsDialog";
import { ManageDialog } from "./components/ManageDialog";
import { ChatControls } from "./components/ChatControls";
import { ChatInput } from "./components/ChatInput";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

export default function Page() {
    const {
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
    } = useChat();
    const [showInput, setShowInput] = useState(false);

    return (
        <div className="flex flex-col gap-2 w-full p-2 min-h-screen bg-gray-900 text-white/90">
            <ChatArea textRef={textcontentRef} fontSize={fontSize} />

            <div className="mt-auto max-w-3xl mx-auto w-full">
                <div className="w-full overflow-hidden flex items-center justify-evenly pb-2">
                    <SettingsDialog
                        modelRef={modelRef}
                        systemRef={systemRef}
                        fontSize={fontSize}
                        setFontSize={setFontSize}
                        paragraphs={paragraphs}
                        setParagraphs={setParagraphs}
                    />

                    <ManageDialog
                        totalTokens={totalTokens}
                        onResetTokens={() => setTotalTokens(0)}
                        onClearChat={clearChat}
                    />
                    <div>
                        <Button
                            className="bg-gray-700 px-4 py-2 rounded-md cursor-pointer"
                            onClick={() => setShowInput(!showInput)}
                        >
                            {!showInput ? (
                                <Plus className="size-4" />
                            ) : (
                                <Minus className="size-4" />
                            )}
                        </Button>
                    </div>
                    <ChatControls
                        disabled={disabled}
                        onReGen={handleReGen}
                        onGen={handleGen}
                    />
                </div>

                {showInput && <ChatInput queryRef={queryRef} />}
            </div>
        </div>
    );
}
