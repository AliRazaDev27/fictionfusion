"use client"
import { useEffect,useRef } from "react";
import { IoPlay } from "react-icons/io5";
import { IoPause } from "react-icons/io5";
import { IoPlayBack } from "react-icons/io5";
import { IoPlayForward } from "react-icons/io5";
import { IoPlaySkipBackSharp } from "react-icons/io5";
import { IoPlaySkipForward } from "react-icons/io5";
export function MusicPlayer({musicSource}:{musicSource:string}) {
    const isPlaying = useRef(false);
    const playRef = useRef<HTMLDivElement>(null);
    const pauseRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const animationFrame = useRef<number | null>(null);
    const audioPlayer = new Audio(musicSource);
      const updateProgress = () => {
    if (progressRef.current && audioPlayer) {
      const { currentTime, duration } = audioPlayer;
      console.log(`currentTime ${currentTime} duration ${duration}`);
      const progress = (currentTime / duration) * 100;
      progressRef.current.style.width = `${progress}%`;
    }
    animationFrame.current = requestAnimationFrame(updateProgress);
  };
    const play = () => {
      if(!isPlaying.current){
        isPlaying.current = true;
        if(playRef.current) playRef.current.style.display = "none";
        if(pauseRef.current) pauseRef.current.style.display = "block";
        audioPlayer.play();
        animationFrame.current = requestAnimationFrame(updateProgress);
      }
      else{
        isPlaying.current = false;
        if(playRef.current) playRef.current.style.display = "block";
        if(pauseRef.current) pauseRef.current.style.display = "none";
        audioPlayer.pause();
        if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
      }
    }
    const seek = (value:number) =>{
      audioPlayer.currentTime = audioPlayer.currentTime + value;
    }
    useEffect(() => {
    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
        audioPlayer.pause();
        audioPlayer.src = "";
    };
}, []);
    return(
        <div className="player">
        <div
        ref={progressRef}
        className="progress-bar absolute top-0 left-0 h-full bg-blueviolet z-[-10]"
      ></div>
      <div className='flex  h-full w-[300px] text-3xl mx-auto items-center justify-between border border-black'>
        <button><IoPlaySkipBackSharp/></button>
        <button onClick={()=>seek(-10)}><IoPlayBack/></button>
        <button onClick={()=>play()}>
            <div>
                <div ref={pauseRef} style={{display:"none"}}><IoPause /></div>
                <div ref={playRef} style={{display:"block"}}><IoPlay/></div>
            </div>
        </button>
        <button onClick={()=>seek(10)}><IoPlayForward /></button>
        <button><IoPlaySkipForward/></button>
        </div>
      </div>
    )
}