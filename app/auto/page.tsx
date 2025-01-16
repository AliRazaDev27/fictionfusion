"use client";

import { addDescription } from "@/actions/update";

export default  function Page() {
  return (
    <div className="container h-[80vh] mx-auto border border-black my-8 flex justify-center items-center ">
    <button className="bg-black px-4 py-2 text-white rounded-xl hover:bg-orange-600" onClick={addDescription}>ADD DESCRIPTION</button>
    </div>
  );
}
