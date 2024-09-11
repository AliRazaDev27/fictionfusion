"use client"
import {gsap} from "gsap"
import {useGSAP} from "@gsap/react"
import { useEffect, useRef, useState } from "react"


export default function Page() {
gsap.registerPlugin(useGSAP)
const box = useRef(null)
useGSAP(
    () => {
        const tl = gsap.timeline({repeat: -1, repeatDelay: 0.5, yoyo: true})
        tl.to(box.current, {x: 200, duration: 2})
        tl.to(box.current, {y: 200, duration: 2})
    },
)
    return (
        <div className="container h-[80vh] mx-auto border border-black my-8 flex justify-center items-center ">
           <div className="bg-red-500 size-8" ref={box}>1</div>
        </div>
    )
}    