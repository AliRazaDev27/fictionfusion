import { Skeleton } from "@/components/ui/skeleton";
export default function Loading(){
    return(
        <div className="relative min-h-[90vh]  flex flex-col justify-between gap-4 py-6 mt-8 px-4 ">
            <div
        className="grid grid-cols-1 sm:grid-cols-6  mx-2 gap-2  text-white"
      >
<Skeleton className=" mx-auto w-[300px] sm:w-full sm:mx-0 aspect-[2/3]   col-span-1 sm:col-span-2 md:col-span-1  rounded-lg overflow-hidden"/>
<Skeleton className="col-span-1 max-sm:min-h-[300px]  pt-2 sm:col-span-4 md:col-span-5 space-y-2 px-4  rounded-2xl border border-gray-800"/>
      </div>
        </div>
    )
}