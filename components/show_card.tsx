import { Show } from "@/types";
import { IoMdCloseCircle } from "react-icons/io";
import { Badge } from "./ui/badge";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { getShowGallery } from "@/actions/showActions";
import Image from "next/image";
import { AddToList } from "./add_to_list";
import { Button } from "./ui/button";
import Link from "next/link";
export async function ShowCard({ show, role,list }: { show: Show, role?: string, list?: any }) {
  let gallery = await getShowGallery(show.id);
  let image = show.image as any;
  let coverSrc = image?.medium ? image?.medium : image?.original;
  if (!coverSrc) coverSrc = "/bookplaceholder.svg";
  let rating = show.rating as any;
  let averageRating = rating;
  if (typeof rating === "object") {
    averageRating = rating?.average ? rating?.average : "0.0";
  }
  return (
    <div className="grid grid-cols-1  md:grid-cols-6   gap-2 mx-2 px-4 py-2 border border-black/50 bg-gray-900 rounded-xl text-white">
      <div className="col-span-1 relative group aspect-[2/3] overflow-hidden rounded-xl ">
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
              <div className="overflow-y-scroll flex flex-wrap">
                {gallery.map((item, index) => (
                  <div key={index}>
                    {item?.resolutions?.medium ? (
                      <img src={item?.resolutions?.medium.url} alt="cover" />
                    ) : (
                      <img src={item?.resolutions?.original.url} alt="cover" />
                    )}
                  </div>
                ))}
              </div>
            </DrawerContent>
          </Drawer>
      </div>

      <div className=" col-span-1 md:col-span-5   space-y-2 px-2 mx-2">
        <h1 className="text-2xl font-semibold">{show.name}</h1>
        <div className="flex flex-wrap gap-4">
          <p className="font-semibold text-lg">{show.type}</p>
          {averageRating && <Badge>{averageRating}</Badge>}
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
        <div className="flex items-center gap-4">
        {role !== "VISITOR" && <AddToList list={list} item={show.id} />}
        {role === "ADMIN" && <Link href={`/track/${show.id}`} className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg">Track</Link>}
        </div>
      </div>
    </div>
  );
}
