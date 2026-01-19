"use client";

import { Show } from "@/types";
import { useState, useEffect, useCallback, useRef } from "react";
import { ShowCard } from "./show_card";
import { ShowDetailsModal } from "./show_details_modal";
import { getFilteredShows } from "@/actions/showActions";
import { Loader2 } from "lucide-react";

interface ShowsGridProps {
    initialShows: Show[];
    initialTotal: number;
    search?: string;
    sort?: string;
    genres?: string[];
    status?: string;
    minRating?: number;
}

export function ShowsGrid({ initialShows, initialTotal, search, sort, genres, status, minRating }: ShowsGridProps) {
    const [shows, setShows] = useState<Show[]>(initialShows);
    const [selectedShow, setSelectedShow] = useState<Show | null>(null);
    const [open, setOpen] = useState(false);

    // Infinite Scroll State
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(initialShows.length < initialTotal);
    const observer = useRef<IntersectionObserver | null>(null);

    // This ref is attached to the last element in the grid
    const lastElementRef = useCallback((node: HTMLDivElement) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        }, {
            rootMargin: "200px" // Trigger 200px before end
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    // Reset state when filters change (server-side initialShows will update)
    useEffect(() => {
        setShows(initialShows);
        setPage(1);
        setHasMore(initialShows.length < initialTotal);
    }, [initialShows, initialTotal]);

    // Fetch more shows when page increases
    useEffect(() => {
        if (page === 1) return; // Initial load is handled by server props

        const loadMore = async () => {
            setLoading(true);
            try {
                const LIMIT = 36;
                const result = await getFilteredShows(page, LIMIT, search, sort, genres, status, minRating);

                if (result?.data && result.data.length > 0) {
                    setShows(prev => {
                        // Filter out any duplicates just in case
                        const newShows = result.data.filter(s => !prev.some(p => p.id === s.id));
                        return [...prev, ...newShows];
                    });

                    const currentTotal = result.total || initialTotal;
                    if ((shows.length + result.data.length) >= currentTotal) {
                        setHasMore(false);
                    }
                } else {
                    setHasMore(false);
                }
            } catch (error) {
                console.error("Failed to load more shows:", error);
            } finally {
                setLoading(false);
            }
        };

        loadMore();
    }, [page, search, sort, genres, status, minRating]);

    const handleShowClick = (show: Show) => {
        setSelectedShow(show);
        setOpen(true);
    };

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-4 gap-y-6">
                {shows.map((show, index) => {
                    // Attach ref to the last item
                    if (index === shows.length - 1) {
                        return (
                            <div ref={lastElementRef} key={show.id}>
                                <ShowCard
                                    show={show}
                                    onClick={() => handleShowClick(show)}
                                />
                            </div>
                        );
                    }
                    return (
                        <ShowCard
                            key={show.id}
                            show={show}
                            onClick={() => handleShowClick(show)}
                        />
                    );
                })}
            </div>

            {loading && (
                <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin text-primary size-8" />
                </div>
            )}

            {!hasMore && shows.length > 0 && (
                <div className="text-center py-10 text-muted-foreground text-sm font-medium">
                    ✨ You've reached the end!
                </div>
            )}

            <ShowDetailsModal
                show={selectedShow}
                open={open}
                onOpenChange={setOpen}
            />
        </>
    );
}
