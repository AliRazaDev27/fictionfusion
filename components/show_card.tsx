import { Show } from "@/types";
import { IoMdCloseCircle } from "react-icons/io";
import { Badge } from "./ui/badge";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { getShowGallery } from "@/actions/showActions";
import Image from "next/image";
import RatingStar from "./ratingStar";
export async function ShowCard({ show}: { show: Show }) {
  let images = show?.type === "MDL" ? null : await getShowGallery(show.id);
  let image = show.image as any;
  let coverSrc = image?.medium ? image?.medium : image?.original;
  if (!coverSrc) coverSrc = "/bookplaceholder.svg";
  let rating = show.rating as any;
  let averageRating = rating;
  if (typeof rating === "object") {
    averageRating = rating?.average ? rating?.average : "0.0";
  }
  const gallery: { image: string, width: number }[] = new Array();
  if (images !== null) {
    for (let item of images) {
      if (item?.resolutions?.medium) gallery.push({ image: item?.resolutions?.medium?.url, width: item?.resolutions?.medium?.width })
      else {
        gallery.push({ image: item?.resolutions?.original?.url, width: item?.resolutions?.original?.width })
      }
    }
    gallery.sort((a, b) => a.width - b.width);
  }
  return (
    <div className="grid grid-cols-1  md:grid-cols-6   gap-2 mx-2 px-4 py-2 border border-black/50 bg-gray-900 rounded-xl text-white">
      <div className="col-span-1 relative group aspect-2/3 overflow-hidden rounded-xl ">
        <Image
          src={coverSrc}
          alt="cover"
          placeholder="blur"
          blurDataURL="/placeholder.svg"
          className="group-hover:blur-md"
          unoptimized
          fill
          style={{ objectFit: "cover" }}
        />
        {
          images !== null && 
        <Drawer>
          <DrawerTrigger className="absolute px-4 py-2 bg-black rounded-xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden group-hover:block text-white hover:bg-blue-900 ">
            View
          </DrawerTrigger>
          <DrawerContent className="h-[90vh] w-full">
            <DrawerHeader className="flex   py-2 -translate-y-4 justify-between items-center">
              <DrawerTitle>
                <span className="font-light text-xl md:text-2xl">
                  Gallery
                </span>{" "}
                / {gallery.length}{" "}
              </DrawerTitle>
              <DrawerClose>
                <IoMdCloseCircle className="size-8" />
              </DrawerClose>
            </DrawerHeader>
            <div className="overflow-y-scroll flex flex-wrap p-4">
              {gallery.map((item, index) => {
                return <img key={index} src={item?.image} alt="cover" className="flex-auto" />
              }
              )}
            </div>
          </DrawerContent>
        </Drawer>
}
      </div>

      <div className=" col-span-1 md:col-span-5 flex flex-col justify-between px-2 mx-2">
        <h1 className="text-2xl font-semibold">{show.name}</h1>
        <div className="flex flex-wrap gap-4">
          <RatingStar rating={averageRating} max={10} />
          {averageRating && <Badge className="text-lg">{averageRating}</Badge>}
        </div>

        <div className="flex flex-wrap gap-4">
          <span className="flex gap-2 font-semibold">
            Status<Badge>{show.status}</Badge>
          </span>
          <span className="flex gap-2 font-semibold">
            Language<Badge>{show.language}</Badge>
          </span>
          {
            show.runtime && <span className="flex gap-2 font-semibold">
              Runtime<Badge>{show.runtime}</Badge>
            </span>
          }
        </div>
        <div className="flex gap-4 flex-wrap">
          <p className="font-semibold">
            Start Date <span className="text-blue-700">{show.premiered}</span>
          </p>
          <p className="font-semibold">
            End Date <span className="text-red-700">{show.ended}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <p className="font-semibold">Genres</p>
          <ul className="flex flex-wrap gap-2">
            {show.genres &&
              show.genres.map((genre, index) => <li key={index}>{genre}</li>)}
          </ul>
        </div>

        <p className="text-lg md:line-clamp-3">{show?.summary}</p>
      </div>
    </div>
  );
}
