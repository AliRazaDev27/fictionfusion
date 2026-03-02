"use client";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when user scrolled down at least 200px (adjust as needed)
      setShow(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {show && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full cursor-pointer bg-gray-800 text-white shadow-lg hover:bg-gray-700 transition"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </>
  );
}
