import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() {

    return (
        <div className="w-full min-h-[90vh] py-6 px-4">
            <div className="grid grid-cols-1  md:grid-cols-6    gap-2 mx-2 px-4 py-2 border-2 border-white/50  rounded-xl">
            <Skeleton className="col-span-1 max-md:w-[210px] min-h-[300px] mx-auto md:mx-0 "/>
            <Skeleton className=" col-span-5  mx-2 min-h-[300px]"/>
            </div>
            </div>
    )
}