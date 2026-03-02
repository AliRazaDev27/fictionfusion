import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FaClipboard } from "react-icons/fa6";

interface ManageDialogProps {
    totalTokens: number;
    onResetTokens: () => void;
    onClearChat: () => void;
}

export function ManageDialog({ totalTokens, onResetTokens, onClearChat }: ManageDialogProps) {
    return (
        <Dialog>
            <DialogTrigger className="bg-gray-700 px-4 py-2.5 rounded-md cursor-pointer">
                <FaClipboard />
            </DialogTrigger>
            <DialogContent className="bg-gray-950 text-gray-300">
                <DialogHeader>
                    <DialogTitle>Manage</DialogTitle>
                    <DialogDescription className="sr-only">Manage your chat history and token usage</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center gap-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button className="bg-gray-700 p-2 rounded-md cursor-pointer">Clear</button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-gray-900 text-white border-gray-700">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Clear Chat</AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-400">
                                    Are you sure you want to clear the chat?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={onClearChat} className="bg-red-600 hover:bg-red-700">Clear</AlertDialogAction>
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
                        onClick={onResetTokens}
                        className="mt-2 text-xs text-gray-500 hover:text-gray-300 cursor-pointer"
                    >
                        Reset counter
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
