import { getCelebs } from "@/actions/celebActions";
import { AddCeleb } from "./addCeleb";
import Link from "next/link";

export default async function Page() {
  const data = await getCelebs();
  return (
    <div className="">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2 md:px-4 md:py-4 ">
        {data.map((celeb) => (
          <div key={celeb?.id} className="flex flex-col items-center justify-between rounded-xl overflow-hidden bg-gray-800">
            <div className="w-full bg-gray-800">
              <img src={celeb.avatar || ""} alt={celeb.title} className="w-full" />
            </div>
            <div className="w-full bg-sky-800 hover:bg-sky-600 transition-colors duration-200">
              <Link href={`/celebs/${celeb.id}`} className="inline-block  w-full py-2 text-white font-medium text-xl text-center">{celeb.title}</Link>
            </div>
          </div>
        ))}
      </div>
      <AddCeleb />
    </div>
  )
}

