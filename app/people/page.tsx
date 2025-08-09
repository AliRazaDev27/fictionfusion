import { getCelebs } from "@/actions/celebActions";
import { AddCeleb } from "./addCeleb";
import Link from "next/link";

export default async function Page(){
  const data = await getCelebs();
  console.log(data)
  return(
  <div className="">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 px-2 py-2 border">
{data.map((celeb) => (
  <div key={celeb.id} className="border rounded-xl overflow-hidden bg-sky-800">
  <div className="">
    <img src={celeb.avatar || ""} alt={celeb.title} className="w-full" />
  </div>
  <Link href={`/people/${celeb.id}`} className="inline-block hover:bg-sky-600 transition-colors duration-200 w-full py-2 text-white font-medium text-xl text-center">{celeb.title}</Link>
  </div>
))}
    </div>
  <AddCeleb />
    </div>
)
}

