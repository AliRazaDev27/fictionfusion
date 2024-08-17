import { Show } from "@/types";
import RatingStar from "./ratingStar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export  function ShowCard({ show }: { show: Show }) {
return(
    <div className="grid grid-cols-1  md:grid-cols-6   gap-2 px-4 py-2">
        <div className="col-span-1 overflow-hidden border-2 mx-auto  border-yellow-700">
            <div className="border relative border-green-700 group">
            {show.image?.medium ? 
            <img src={show.image?.medium} alt="cover"  className="w-full h-full group-hover:blur-md"/> :
            <img src={show.image?.original} alt="org_cover" className="w-full h-full group-hover:blur-md" />
            }
            <Button  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden group-hover:block text-white hover:bg-blue-900 ">View</Button>
            </div>

            
        </div>

        <div className="border border-red-500 col-span-5 space-y-2 px-2 mx-2">
        <h1 className="text-2xl font-semibold">{show.name}</h1>
        <div className="flex flex-wrap gap-4">
            <p className="font-semibold text-lg">{show.type}</p>
            <Badge>{show.rating.average}</Badge>
        </div>
        
        <div className="flex flex-wrap gap-4">
            <span className="flex gap-2 font-semibold">Status<Badge>{show.status}</Badge></span>
        <span className="flex gap-2 font-semibold">Language<Badge>{show.language}</Badge></span>
            <span className="flex gap-2 font-semibold">Runtime<Badge>{show.runtime}</Badge></span>
        </div>
        <div className="flex gap-4 flex-wrap">
<p className="font-semibold">Start Date <span className="text-blue-700">{show.premiered}</span></p>
<p className="font-semibold">End Date <span className="text-red-700">{show.ended}</span></p>

        </div>
        <div className="flex flex-wrap gap-2">
            <p className="font-semibold">Genres</p>
            <ul className="flex flex-wrap gap-2">
    {show.genres.map((genre, index) => (
        <li key={index}>{genre}</li>
    ))}
</ul>
        </div>
        
<p className="text-lg">{show.summary}</p>

        </div>
    </div>
)
}