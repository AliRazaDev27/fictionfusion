"use client";

import { getMusic } from "@/actions/musicActions";

export default function Test() {
  const test = async () => {
    const response = await getMusic();
    console.log(response);
  }
  return (
    <div>
      <button onClick={test}>Test</button>
    </div>
  );
}