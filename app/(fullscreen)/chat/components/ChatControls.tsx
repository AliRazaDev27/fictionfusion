import React from "react";
import { Button } from "@/components/ui/button";
import { FaPlay } from "react-icons/fa";
import { IoReloadSharp } from "react-icons/io5";

interface ChatControlsProps {
    disabled: boolean;
    onReGen: () => void;
    onGen: () => void;
}

export function ChatControls({ disabled, onReGen, onGen }: ChatControlsProps) {
    return (
        <>
            <Button className="bg-gray-700 px-4 py-2 rounded-md cursor-pointer" disabled={disabled} onClick={onReGen}>
                <IoReloadSharp />
            </Button>
            <Button className="bg-gray-700 px-4 py-2 rounded-md cursor-pointer" disabled={disabled} onClick={onGen}>
                <FaPlay />
            </Button>
        </>
    );
}
