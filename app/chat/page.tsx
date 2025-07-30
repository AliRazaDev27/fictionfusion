"use client";
import { sendMessage } from "@/actions/chatActions";
import { Input } from "@/components/ui/input";
import { useState } from "react";
export default function Page() {
    const [content,setContent] = useState<string>("");
    const handleSend = async (message:string) => {
        const response = await sendMessage(message);
        setContent(response);
    }
    return (
        <div className="flex flex-col w-full h-[89svh] bg-gray-800 text-white/90">
            <div className="flex-1 overflow-y-auto overflow-hidden w-full p-4">
                <pre className="w-full text-lg  text-wrap">{content}</pre>
            </div>
            <div className="mt-auto">
                <Input 
                className="w-2/3 mx-auto text-black"
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