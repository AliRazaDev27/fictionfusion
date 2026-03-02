"use client";

import { Show } from "@/types";
import { Badge } from "./ui/badge";
import Image from "next/image";
import RatingStar from "./ratingStar";
import { useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Heart, Calendar, Clock, Globe } from "lucide-react";
import { deleteShowByID } from "@/actions/showActions";
import { useToast } from "@/components/ui/use-toast";

interface ShowDetailsModalProps {
    show: Show | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ShowDetailsModal({ show, open, onOpenChange }: ShowDetailsModalProps) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    if (!show) return null;

    let image = show.image as any;
    let coverSrc = image?.medium ? image?.medium : image?.original;
    if (!coverSrc) coverSrc = "/bookplaceholder.svg";

    let rating = show.rating as any;
    let averageRating = rating;

    if (typeof rating === "object") {
        averageRating = rating?.average ? rating?.average : 0;
    }

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this show? This action cannot be undone.")) {
            startTransition(async () => {
                const result = await deleteShowByID(show.id);
                if (result.success) {
                    toast({
                        title: "Show Deleted",
                        description: `"${show.name}" has been removed.`,
                    });
                    onOpenChange(false);
                } else {
                    toast({
                        title: "Error",
                        description: "Failed to delete show.",
                        variant: "destructive"
                    });
                }
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[90vh] md:h-auto overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold">{show.name}</DialogTitle>
                    <DialogDescription className="text-lg text-muted-foreground">
                        {show.premiered?.split("-")[0]} • {show.language}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 mt-4">
                    {/* Left Column: Image & Quick Stats */}
                    <div className="space-y-4">
                        <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden shadow-lg border border-border">
                            <Image
                                src={coverSrc}
                                alt={show.name}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>

                        <div className="flex flex-wrap gap-2 justify-center">
                            <Badge variant="outline" className="flex gap-1 items-center">
                                <Clock className="size-3" /> {show.runtime ? `${show.runtime}m` : "N/A"}
                            </Badge>
                            <Badge variant="outline" className="flex gap-1 items-center">
                                <Globe className="size-3" /> {show.language}
                            </Badge>
                            <Badge variant="outline" className="flex gap-1 items-center">
                                <Calendar className="size-3" /> {show.premiered || "N/A"}
                            </Badge>
                        </div>
                    </div>

                    {/* Right Column: Details & Actions */}
                    <div className="flex flex-col gap-6">

                        {/* Rating Section */}
                        <div className="flex items-center gap-3">
                            <span className="text-muted-foreground font-medium">Rating:</span>
                            <div className="flex items-center gap-2">
                                <RatingStar rating={averageRating} max={5} />
                                <span className="text-2xl font-bold">{averageRating}</span>
                                <span className="text-sm text-muted-foreground">/ 10</span>
                            </div>
                        </div>

                        {/* Genres */}
                        <div className="space-y-2">
                            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Genres</h4>
                            <div className="flex flex-wrap gap-2">
                                {show.genres && show.genres.map((g, i) => (
                                    <Badge key={i} className="px-3 py-1 text-sm">{g}</Badge>
                                ))}
                            </div>
                        </div>

                        {/* Summary */}
                        <div className="space-y-2 flex-1">
                            <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Summary</h4>
                            <div
                                className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: show.summary || "No summary available." }}
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3 mt-auto pt-4 border-t border-border">
                            <Button variant="default" className="flex-1 md:flex-none gap-2">
                                <Heart className="size-4" /> Add to Favorites
                            </Button>
                            <Button variant="secondary" className="flex-1 md:flex-none gap-2">
                                <Edit className="size-4" /> Edit Details
                            </Button>
                            <Button
                                variant="destructive"
                                className="flex-1 md:flex-none gap-2 ml-auto"
                                onClick={handleDelete}
                                disabled={isPending}
                            >
                                {isPending ? "Deleting..." : <><Trash2 className="size-4" /> Delete Show</>}
                            </Button>
                        </div>

                    </div>
                </div>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
