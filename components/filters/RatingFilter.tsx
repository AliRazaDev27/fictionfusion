"use client"

import * as React from "react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingFilterProps {
    value: number
    onChange: (value: number) => void
}

export function RatingFilter({ value, onChange }: RatingFilterProps) {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-end">
                <Label className="text-muted-foreground text-xs uppercase tracking-wider">Minimum Score</Label>
                <div className="flex items-center gap-1 text-primary">
                    <span className="text-2xl font-bold">{value}</span>
                    <Star className="size-4 fill-primary text-primary mb-1" />
                </div>
            </div>
            <Slider
                defaultValue={[value]}
                max={10}
                step={0.5}
                value={[value]}
                onValueChange={(vals) => onChange(vals[0])}
                className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground font-medium px-1 uppercase">
                <span>0 (Any)</span>
                <span>10 (Masterpiece)</span>
            </div>
        </div>
    )
}
