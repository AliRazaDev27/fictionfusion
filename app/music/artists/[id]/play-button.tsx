"use client";
import { useRef, useState } from "react";

export function PlayButton({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <div className="me-2">
      <button className="text-2xl cursor-pointer" onClick={togglePlay}>
        {playing ? "⏸️" : "▶️"}
      </button>
      <audio ref={audioRef} src={src} preload="none"/>
    </div>
  );
}
