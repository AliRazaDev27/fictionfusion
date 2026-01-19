"use client"

import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface FacetFilterProps {
    title: string
    options: {
        label: string
        value: string
    }[]
    selectedValues: Set<string>
    onSelect: (value: string) => void
}

export function FacetFilter({
    title,
    options,
    selectedValues,
    onSelect,
}: FacetFilterProps) {
    const [query, setQuery] = React.useState("")

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(query.toLowerCase())
    )

    const selectedCount = selectedValues.size

    return (
        <div className="flex flex-col gap-3">
            {selectedCount > 0 && (
                <div className="flex gap-2 flex-wrap mb-1">
                    {options.filter(o => selectedValues.has(o.value)).map(o => (
                        <Badge key={o.value} variant="secondary" className="gap-1 pr-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors group" onClick={() => onSelect(o.value)}>
                            {o.label}
                            <div className="bg-foreground/10 group-hover:bg-destructive-foreground/20 rounded-full p-0.5">
                                <span className="sr-only">Remove</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                            </div>
                        </Badge>
                    ))}
                </div>
            )}

            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                    placeholder={`Search ${title}...`}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-8 h-9 text-xs bg-secondary/30 border-transparent focus:bg-background focus:border-primary"
                />
            </div>
            <ScrollArea className="h-[200px] w-full pr-3">
                <div className="flex flex-col gap-1">
                    {filteredOptions.length === 0 && (
                        <p className="text-xs text-muted-foreground py-4 text-center">No results found.</p>
                    )}
                    {filteredOptions.map((option) => {
                        const isSelected = selectedValues.has(option.value)
                        return (
                            <div
                                key={option.value}
                                onClick={() => onSelect(option.value)}
                                className={cn(
                                    "flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer text-sm transition-colors",
                                    isSelected
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <span>{option.label}</span>
                                {isSelected && <Check className="h-3 w-3" />}
                            </div>
                        )
                    })}
                </div>
            </ScrollArea>
        </div>
    )
}
