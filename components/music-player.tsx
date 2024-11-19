"use client"
import { useEffect,useRef } from "react";
import { IoPlay } from "react-icons/io5";
import { IoPause } from "react-icons/io5";
import { IoPlayBack } from "react-icons/io5";
import { IoPlayForward } from "react-icons/io5";
import { IoPlaySkipBackSharp } from "react-icons/io5";
import { IoPlaySkipForward } from "react-icons/io5";
export function MusicPlayer({musicSource,next,prev}:{musicSource:string,next:Function,prev:Function}) {
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
      progressRef.current.style.width = `${progress}%`;
    }
    animationFrame.current = requestAnimationFrame(updateProgress);
  };
    const play = () => {
      if(!isPlaying.current){
        isPlaying.current = true;
        if(playRef.current) playRef.current.style.display = "none";
        if(pauseRef.current) pauseRef.current.style.display = "block";
        if(audioPlayer.current) audioPlayer.current.play();
        animationFrame.current = requestAnimationFrame(updateProgress);
      }
      else{
        isPlaying.current = false;
        if(playRef.current) playRef.current.style.display = "block";
        if(pauseRef.current) pauseRef.current.style.display = "none";
        if(audioPlayer.current) audioPlayer.current.pause();
        if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
      }
    }
    const seek = (value:number) =>{
     if(audioPlayer.current) audioPlayer.current.currentTime = audioPlayer.current.currentTime + value;
    }
    useEffect(() => {
    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
        console.log("wrap up")
if(audioPlayer.current){
        audioPlayer.current.pause();
        audioPlayer.current.src = "";
}
    };
}, []);
    return(
        <div className="player">
          <audio src={musicSource} preload="auto" autoPlay={isPlaying.current} ref={audioPlayer}></audio>
        <div
        ref={progressRef}
        className="progress-bar absolute top-0 left-0 h-full bg-blueviolet z-[-10]"
      ></div>
      <div className='flex  h-full w-[300px] text-3xl mx-auto items-center justify-between'>
        <button onClick={()=>prev()}><IoPlaySkipBackSharp/></button>
        <button onClick={()=>seek(-10)}><IoPlayBack/></button>
        <button onClick={()=>play()}>
            <div>
                <div ref={pauseRef} style={{display:"none"}}><IoPause /></div>
                <div ref={playRef} style={{display:"block"}}><IoPlay/></div>
            </div>
        </button>
        <button onClick={()=>seek(10)}><IoPlayForward /></button>
        <button onClick={()=>next()}><IoPlaySkipForward/></button>
        </div>
      </div>
    )
}