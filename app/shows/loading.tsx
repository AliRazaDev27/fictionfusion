import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() {
    console.log("b",performance.now())
    return (
<div className="min-h-[90vh] py-6 px-4 mt-8 ">
<div className=" grid grid-cols-1 min-h-[300px]  md:grid-cols-6 gap-4">
<Skeleton className="col-span-1 max-md:w-[210px] aspect-[2/3]  md:mx-0 mx-auto "/>
<Skeleton className="col-span-1 md:col-span-5 h-[300px]  px-2 mx-2"/>
</div>
</div>
    )
}