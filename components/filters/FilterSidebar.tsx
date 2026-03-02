"use client"

import * as React from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Search, X, SlidersHorizontal, ArrowUpDown } from "lucide-react"

import { FacetFilter } from "./FacetFilter"
import { RatingFilter } from "./RatingFilter"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { getSortOptions } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface FilterSidebarProps {
    genres: string[]
}

const STATUS_OPTIONS = [
    { label: "Running", value: "Running" },
    { label: "Ended", value: "Ended" },
    { label: "In Development", value: "In Development" },
    { label: "To Be Determined", value: "To Be Determined" },
]

export function FilterSidebar({ genres }: FilterSidebarProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()

    // State
    const [search, setSearch] = React.useState(searchParams.get("search") || "")
    const [selectedGenres, setSelectedGenres] = React.useState<Set<string>>(
        new Set(searchParams.get("genres")?.split(',').filter(Boolean))
    )
    const [status, setStatus] = React.useState<Set<string>>(
        new Set(searchParams.get("status") ? [searchParams.get("status")!] : [])
    )
    const [minRating, setMinRating] = React.useState(
        Number(searchParams.get("minRating")) || 0
    )
    const [sort, setSort] = React.useState(searchParams.get("sort") || "year_newest")

    // Handlers
    const handleGenreSelect = (value: string) => {
        const newGenres = new Set(selectedGenres)
        if (newGenres.has(value)) {
            newGenres.delete(value)
        } else {
            newGenres.add(value)
        }
        setSelectedGenres(newGenres)
    }

    const handleStatusSelect = (value: string) => {
        const newStatus = new Set<string>()
        if (!status.has(value)) {
            newStatus.add(value)
        } else {
            // Toggle off if already selected (optional, but good UX)
            // Actually usually status filter is one or the other or all.
            // Let's keep toggle behavior.
        }
        setStatus(newStatus)
    }

    const applyFilters = () => {
        const params = new URLSearchParams()

        // Always reset to page 1
        params.set("page", "1")

        if (search) params.set("search", search)
        if (selectedGenres.size > 0) params.set("genres", Array.from(selectedGenres).join(','))
        if (status.size > 0) params.set("status", Array.from(status)[0])
        if (minRating > 0) params.set("minRating", minRating.toString())
        if (sort) params.set("sort", sort)

        router.push(`${pathname}?${params.toString()}`)
    }

    const resetFilters = () => {
        setSearch("")
        setSelectedGenres(new Set())
        setStatus(new Set())
        setMinRating(0)
        setSort("year_newest")
        router.push(pathname)
    }

    const sortOptions = getSortOptions("shows")

    // Handle Enter key for search
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            applyFilters()
        }
    }

    return (
        <div className="flex flex-col h-full bg-background/95 backdrop-blur-sm">

            {/* Search & Sort Section */}
            <div className="flex flex-col gap-5 p-1">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search by title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="pl-9 bg-secondary/50 border-transparent focus:bg-background focus:border-primary transition-all duration-300"
                    />
                    {search && (
                        <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            <X className="size-4" />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <ArrowUpDown className="size-4 text-muted-foreground" />
                    <Select value={sort} onValueChange={setSort}>
                        <SelectTrigger className="w-full bg-secondary/30 border-secondary hover:bg-secondary/50 transition-colors">
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                            {sortOptions.map((option: any) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Separator className="my-6 bg-border/50" />

            {/* Filters Accordion */}
            <Accordion type="multiple" defaultValue={["genres", "rating", "status"]} className="w-full space-y-4">

                <AccordionItem value="genres" className="border-none">
                    <AccordionTrigger className="hover:no-underline py-2 text-base font-semibold text-foreground/90 hover:text-primary transition-colors">
                        Genres
                    </AccordionTrigger>
                    <AccordionContent className="pt-2">
                        <FacetFilter
                            title="Genre"
                            options={genres.map(g => ({ label: g, value: g }))}
                            selectedValues={selectedGenres}
                            onSelect={handleGenreSelect}
                        />
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="status" className="border-none">
                    <AccordionTrigger className="hover:no-underline py-2 text-base font-semibold text-foreground/90 hover:text-primary transition-colors">
                        Status
                    </AccordionTrigger>
                    <AccordionContent className="pt-2">
                        <div className="flex flex-wrap gap-2">
                            {STATUS_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleStatusSelect(opt.value)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border",
                                        status.has(opt.value)
                                            ? "bg-primary text-primary-foreground border-primary shadow-sm scale-105"
                                            : "bg-secondary/50 text-muted-foreground border-transparent hover:bg-secondary hover:text-foreground"
                                    )}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="rating" className="border-none">
                    <AccordionTrigger className="hover:no-underline py-2 text-base font-semibold text-foreground/90 hover:text-primary transition-colors">
                        Rating
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 px-1">
                        <RatingFilter value={minRating} onChange={setMinRating} />
                    </AccordionContent>
                </AccordionItem>

            </Accordion>

            {/* Actions */}
            <div className="flex flex-col gap-3 mt-auto pt-6 pb-2 sticky bottom-0 bg-background/95 backdrop-blur z-10">
                <Button
                    onClick={applyFilters}
                    className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-md hover:shadow-lg transition-all duration-300"
                >
                    Show Results
                </Button>
                <Button variant="ghost" onClick={resetFilters} className="text-muted-foreground hover:text-foreground">
                    Reset Filters
                </Button>
            </div>

        </div>
    )
}
