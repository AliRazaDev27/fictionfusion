"use client";
import { clean } from "@/actions/cleaner";

export default  function Page() {

  return (
    <div className="container h-[80vh] mx-auto border border-black my-8 flex justify-center items-center ">
      <button className="bg-green-500 text-white px-4 py-2">Clean</button>
    </div>
  );
}
