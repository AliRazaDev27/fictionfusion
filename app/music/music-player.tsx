"use client"
import { useEffect, useRef } from "react";
import { IoPlay } from "react-icons/io5";
import { IoPause } from "react-icons/io5";
import { IoPlayBack } from "react-icons/io5";
import { IoPlayForward } from "react-icons/io5";
import { IoPlaySkipBackSharp } from "react-icons/io5";
import { IoPlaySkipForward } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { IoIosCloseCircle } from "react-icons/io";
import { useMusicStore } from "./music-context";
export function MusicPlayer() {
  const music = useMusicStore((state: any) => state.music)
  const current = useMusicStore((state: any) => state.current)
  const musicSource = music && music[current]?.fileUrlPublic || undefined;
  const metadata: Metadata = music && music[current] || { title: "", artist: "", coverArt: null }
  const setCurrent = useMusicStore((state: any) => state.setCurrent)
  const next = () => {
    if (!music) return
    const nextIndex = (current + 1) % music.length;
    const nextCard = document.getElementById(`music-card-${nextIndex}`);
    if (nextCard) {
      nextCard.scrollIntoView({ behavior: "smooth" });
    }
    setCurrent(nextIndex);
  }
  const prev = () => {
    if (!music) return
    const prevIndex = (current - 1 + music.length) % music.length
    const prevCard = document.getElementById(`music-card-${prevIndex}`);
    if (prevCard) {
      prevCard.scrollIntoView({ behavior: "smooth" });
    }
    setCurrent(prevIndex);
  }


  const isPlaying = useRef(false);
  const playRef = useRef<HTMLDivElement>(null);
  const pauseRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const animationFrame = useRef<number | null>(null);
  const audioPlayer = useRef<HTMLAudioElement>(null);
  const updateProgress = () => {
    if (progressRef.current && audioPlayer.current) {
      const { currentTime, duration } = audioPlayer.current;
      const progress = (currentTime / duration) * 100;
      const updatedWitdh = 100 - progress;
      progressRef.current.style.width = `${updatedWitdh}%`;
    }
    animationFrame.current = requestAnimationFrame(updateProgress);
  };
  const play = () => {
    if (!isPlaying.current) {
      isPlaying.current = true;
      if (playRef.current) playRef.current.style.display = "none";
      if (pauseRef.current) pauseRef.current.style.display = "block";
      if (audioPlayer.current) {
        if (audioPlayer.current.src !== musicSource) {
          if (musicSource) audioPlayer.current.src = musicSource;
        }
        audioPlayer.current.play();
      }
      animationFrame.current = requestAnimationFrame(updateProgress);
    }
    else {
      isPlaying.current = false;
      if (playRef.current) playRef.current.style.display = "block";
      if (pauseRef.current) pauseRef.current.style.display = "none";
      if (audioPlayer.current) audioPlayer.current.pause();
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    }
  }
  const seek = (value: number) => {
    if (audioPlayer.current) audioPlayer.current.currentTime = audioPlayer.current.currentTime + value;
  }
  const nextTrack = () => {
    next()
  }
  const prevTrack = () => {
    prev()
  }
  useEffect(() => {
    if (!music) return;
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: metadata.title,
        artist: metadata.artist,
        artwork: [
          { src: metadata.coverArt || "/music-player.png", sizes: '96x96', type: 'image/png' },
          { src: metadata.coverArt || "/music-player.png", sizes: '128x128', type: 'image/png' },
          { src: metadata.coverArt || "/music-player.png", sizes: '192x192', type: 'image/png' },
          { src: metadata.coverArt || "/music-player.png", sizes: '256x256', type: 'image/png' },
        ]
      })
      navigator.mediaSession.setActionHandler('play', play)
      navigator.mediaSession.setActionHandler('pause', play)
      navigator.mediaSession.setActionHandler('previoustrack', prevTrack)
      navigator.mediaSession.setActionHandler('nexttrack', nextTrack)
    }
    const playNextSong = () => {
      next()
    }
    if (audioPlayer.current) {
      audioPlayer.current.addEventListener("ended", playNextSong)
    }
    return () => {
      if (audioPlayer.current) {
        audioPlayer.current.removeEventListener("ended", playNextSong)
      }
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = null
        navigator.mediaSession.setActionHandler('play', null)
        navigator.mediaSession.setActionHandler('pause', null)
        navigator.mediaSession.setActionHandler('previoustrack', null)
        navigator.mediaSession.setActionHandler('nexttrack', null)
      }
    }
  }, [musicSource, next, prev, music, current])

  useEffect(() => {
    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
      if (audioPlayer.current) {
        audioPlayer.current.pause();
        audioPlayer.current.src = "";
      }
    };
  }, []);
  return (
    <div className="flex w-full h-full">
      <div className="player">
        <audio src={musicSource || undefined} preload="auto" autoPlay={isPlaying.current} ref={audioPlayer}>Audio playback not supported</audio>
        <div
          ref={progressRef}
          className="progress-bar"
        ></div>
        <div className="flex w-full h-full">
          <div className='flex h-full w-[300px] text-3xl mx-auto items-center justify-between'>
            <button onClick={() => prev()} className="cursor-pointer hover:scale-125 transition-transform duration-150"><IoPlaySkipBackSharp /></button>
            <button onClick={() => seek(-10)} className="cursor-pointer hover:scale-125 transition-transform duration-150"><IoPlayBack /></button>
            <button onClick={() => play()} className="cursor-pointer hover:scale-125 transition-transform duration-150">
              <div>
                <div ref={pauseRef} style={{ display: "none" }}><IoPause /></div>
                <div ref={playRef} style={{ display: "block" }}><IoPlay /></div>
              </div>
            </button>
            <button onClick={() => seek(10)} className="cursor-pointer hover:scale-125 transition-transform duration-150"><IoPlayForward /></button>
            <button onClick={() => next()} className="cursor-pointer hover:scale-125 transition-transform duration-150"><IoPlaySkipForward /></button>
          </div>
        </div>
      </div>

      <div className="absolute z-50 -top-[1.5%] -translate-y-full left-1/2 -translate-x-1/2 md:hidden bg-cyan-600 text-white rounded-full overflow-hidden">
        <button
          className="w-12 h-12 flex items-center justify-center cursor-pointer"
          onClick={() => {
            console.log('click')
            const sidebar = document.getElementById("sidebar");
            const openButton = document.getElementById("sidebar-open");
            const closeButton = document.getElementById("sidebar-close");
            console.log(sidebar, openButton, closeButton)

            if (sidebar && openButton && closeButton) {
              if (openButton.style.display === "block" || !openButton.style.display) {
                console.log('what')
                sidebar.style.transform = "translateX(100%)";
                console.log(sidebar.style.transform)
                openButton.style.display = "none";
                closeButton.style.display = "block";
              } else {
                console.log('what2')
                sidebar.style.transform = "translateX(-100%)";
                openButton.style.display = "block";
                closeButton.style.display = "none";
              }
            }
          }}>
          <span id="sidebar-open" className="text-2xl block">
            <IoSearch />
          </span>
          <span id="sidebar-close" className="text-3xl hidden">
            <IoIosCloseCircle />
          </span>
        </button>
      </div>
    </div>
  )
}

type Metadata = {
  title: string;
  artist: string;
  coverArt: string | null;
}