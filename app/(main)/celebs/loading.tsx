import { Skeleton } from "@/components/ui/skeleton"
export default function Loading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2 md:px-4 md:py-4">
      <Skeleton className="w-full aspect-[5/6]" />
      <Skeleton className="w-full aspect-[5/6] hidden sm:block" />
      <Skeleton className="w-full aspect-[5/6] hidden md:block" />
      <Skeleton className="w-full aspect-[5/6] hidden lg:block" />
    </div>
  )
}
