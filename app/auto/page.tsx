"use client";
import { sendEmail } from "@/actions/emailActions";

export default  function Page() {
  return (
    <div className="container h-[80vh] mx-auto border border-black my-8 flex justify-center items-center ">
      <div>
        <form action={sendEmail} className="flex flex-col gap-3 text-white border rounded-xl px-4 py-4 ">
          <label htmlFor="msg">Message</label>
          <input className="text-black px-2 py-1" type="text" id="msg" name="msg" />
          <button className="ms-auto bg-green-600 text-white font-semibold px-4 py-2 w-fit rounded-xl" type="submit">Send</button>
          </form>
      </div>
    </div>
  );
}
