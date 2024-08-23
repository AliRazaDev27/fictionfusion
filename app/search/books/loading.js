import { Skeleton } from "@/components/ui/skeleton"
import { Divide } from "lucide-react"

export default function Loading() {

    return (
        <div className="w-full min-h-[90vh] bg-gradient-to-b from-black/90 via-gray-800 to-gray-900 px-4 py-6">
            <div className="flex  flex-col md:flex-row gap-8 max-md:items-center  my-8">
            <Skeleton className="min-w-[300px] aspect-[3/4] rounded-2xl overflow-hidden" />
            <Skeleton className="w-full min-h-80 rounded-2xl " />
            </div>
        </div>

    )
} 