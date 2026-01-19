"use client"

import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { getSortOptions } from "@/lib/utils"
// Use Lucide icons if available, matching previous usage of icons
import { ChevronDown, Search, X } from "lucide-react"

// Or use the provided ChevronDownIcon if lucide is not installed
function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    )
}

export function SearchControls({ type }: { type: string }) {
    const searchParams = useSearchParams()
    const path = usePathname()
    const router = useRouter()

    const [search, setSearch] = useState(searchParams.get("search") || "")
    const [sortOption, setSortOption] = useState(searchParams.get("sort") || "year_newest")

    const sortOptions = getSortOptions(type)

    const handleFilter = useCallback(() => {
        const params = new URLSearchParams()
        params.set("page", "1") // Reset to page 1 on filter
        if (search) params.set("search", search)
        if (sortOption) params.set("sort", sortOption)

        router.push(`${path}?${params.toString()}`)
    }, [search, sortOption, path, router])

    const handleReset = () => {
        setSearch("")
        setSortOption("year_newest")
        router.push(path)
        router.refresh()
    }

    // Handle Enter key in Search
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.currentTarget.blur()
            handleFilter()
        }
    }

    const currentSortLabel = sortOptions.find(o => o.value === sortOption)?.label || "Sort By"

    return (
        <div className="flex flex-col gap-4 w-full max-w-lg mx-auto p-4">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Search</label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="pl-9"
                    />
                    {search && (
                        <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                            <X className="size-4" />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-muted-foreground">Sort Order</label>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="justify-between">
                            {currentSortLabel}
                            <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)]">
                        <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {sortOptions.map((option: any) => (
                            <DropdownMenuItem key={option.value} onClick={() => setSortOption(option.value)}>
                                {option.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="flex gap-2 mt-2">
                <Button className="flex-1" onClick={handleFilter}>
                    Apply Filters
                </Button>
                <Button variant="secondary" onClick={handleReset}>
                    Reset
                </Button>
            </div>
        </div>
    )
}
