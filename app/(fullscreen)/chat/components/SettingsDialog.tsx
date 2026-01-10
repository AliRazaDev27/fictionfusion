import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { IoSettings } from "react-icons/io5";
import { models_groq, systems } from "@/lib/ai";

interface SettingsDialogProps {
    modelRef: React.MutableRefObject<string>;
    systemRef: React.MutableRefObject<string>;
    fontSize: string;
    setFontSize: (size: string) => void;
}

export function SettingsDialog({ modelRef, systemRef, fontSize, setFontSize }: SettingsDialogProps) {
    return (
        <Dialog>
            <DialogTrigger className="bg-gray-700 px-4 py-2.5 rounded-md cursor-pointer">
                <IoSettings />
            </DialogTrigger>
            <DialogContent className="bg-gray-950 text-gray-300">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription className="sr-only">Choose a model, system, and temperature</DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-between w-full">
                    <Select defaultValue={modelRef.current} onValueChange={(e) => { modelRef.current = e }}>
                        <SelectTrigger className="w-fit bg-gray-700">
                            <SelectValue placeholder="Models" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 text-slate-400">
                            {models_groq.map((model) => (
                                <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select defaultValue={systemRef.current} onValueChange={(e) => { systemRef.current = e }}>
                        <SelectTrigger className="w-fit bg-gray-700">
                            <SelectValue placeholder="Systems" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 text-slate-400">
                            {Object.entries(systems).map(([key]) => (
                                <SelectItem key={key} value={key}>{key.toUpperCase()}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select defaultValue={fontSize} onValueChange={setFontSize}>
                        <SelectTrigger className="w-fit bg-gray-700">
                            <SelectValue placeholder="Font Size" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 text-slate-400">
                            <SelectItem value="14px">Small (14px)</SelectItem>
                            <SelectItem value="16px">Normal (16px)</SelectItem>
                            <SelectItem value="20px">Medium (20px)</SelectItem>
                            <SelectItem value="24px">Large (24px)</SelectItem>
                            <SelectItem value="32px">XL (32px)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </DialogContent>
        </Dialog>
    );
}
