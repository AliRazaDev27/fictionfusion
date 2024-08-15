"use client"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
  import { getOpenLibraryCoverLink } from "@/lib"
export default  function BookCoverCarousel({list}:{list:string}) {
const isbnList:string[] = JSON.parse(list)
for(let isbn of isbnList){
    console.log(getOpenLibraryCoverLink("isbn",isbn,"M"))
}

    return(
        <div>
<img src={getOpenLibraryCoverLink("isbn",isbnList[1],"M")} alt="cover" width={300} height={400}  />
        </div>


    )
}  