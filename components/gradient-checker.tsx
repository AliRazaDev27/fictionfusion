"use client"
import {  useEffect, useState } from "react"

const gradients = [
  'linear-gradient(220.55deg, #A531DC 0%, #4300B1 100%)',
   'linear-gradient(220.55deg, #FF896D 0%, #D02020 100%)',
  'linear-gradient(220.55deg, #3793FF 0%, #0017E4 100%)',
  'linear-gradient(220.55deg, #FFD439 0%, #FF7A00 100%)',
  'linear-gradient(220.55deg, #7CF7FF 0%, #4B73FF 100%)',
  'linear-gradient(220.55deg, #FFED46 0%, #FF7EC7 100%)',
  'linear-gradient(220.55deg, #8FFF85 0%, #39A0FF 100%)',
  'linear-gradient(220.55deg, #8A88FB 0%, #D079EE 100%)',
  'linear-gradient(220.55deg, #EAEAEA 0%, #8B8B8B 100%)',
  'linear-gradient(220.55deg, #FFEB3A 0%, #4DEF8E 100%)',
  'linear-gradient(220.55deg, #565656 0%, #181818 100%)',
  'linear-gradient(220.55deg, #FFBB89 0%, #7B6AE0 100%)',
  'linear-gradient(220.55deg, #FFF500 0%, #FFB800 100%)',
  'linear-gradient(220.55deg, #FFEAF6 0%, #FF9DE4 100%)',
  'linear-gradient(220.55deg, #00B960 0%, #00552C 100%)',
  'linear-gradient(220.55deg, #FFE6A4 0%, #AD8211 100%)',
  'linear-gradient(220.55deg, #C5EDF5 0%, #4A879A 100%)',
  'linear-gradient(220.55deg, #FFF6EB 0%, #DFD1C5 100%)',
  'linear-gradient(220.55deg, #FF9D7E 0%, #4D6AD0 100%)',
  'linear-gradient(220.55deg, #DD7BFF 0%, #FF6C6C 100%)',
  'linear-gradient(220.55deg, #E0FF87 0.01%, #8FB85B 100%)',
  'linear-gradient(220.55deg, #FFDC99 0%, #FF62C0 100%)',
  'linear-gradient(220.55deg, #DDE4FF 0%, #8DA2EE 100%)',
  'linear-gradient(220.55deg, #97E8B5 0%, #5CB67F 100%)',
  'linear-gradient(220.55deg, #24CFC5 0%, #001C63 100%)',
  'linear-gradient(220.55deg, #FF3F3F 0%, #063CFF 100%)',
  'linear-gradient(220.55deg, #5D85A6 0%, #0E2C5E 100%)',
  'linear-gradient(220.55deg, #DEB5FF 0%, #6F00B3 100%)',
  'linear-gradient(220.55deg, #FF5EEF 0%, #456EFF 100%)',
  'linear-gradient(220.55deg, #AFCCCB 0%, #616566 100%)',
  'linear-gradient(220.55deg, #4063BC 0%, #6B0013 100%)',
  'linear-gradient(220.55deg, #FFF500 0%, #FF00B8 100%)',
  'linear-gradient(220.55deg, #FF5E98 0%, #0F213E 100%)',
  'linear-gradient(220.55deg, #FFC328 0%, #E20000 100%)',
  'linear-gradient(220.55deg, #FFE70B 0%, #27B643 100%)',
  'linear-gradient(220.55deg, #FFADF7 0%, #B1FF96 100%)',
  'linear-gradient(220.55deg, #61C695 0%, #133114 100%)',
  'linear-gradient(220.55deg, #B7DCFF 0%, #FFA4F6 100%)',
  'linear-gradient(220.55deg, #9F25FF 0%, #FF7A00 100%)',
  'linear-gradient(220.55deg, #5EE2FF 0%, #00576A 100%)',
  'linear-gradient(220.55deg, #FF0000 0%, #470000 100%)',
  'linear-gradient(220.55deg, #4643DF 0%, #0B0A47 100%)',
  'linear-gradient(220.55deg, #D7003A 0%, #19087E 100%)',
  'linear-gradient(220.55deg, #FADD76 0%, #9F3311 100%)',
  'linear-gradient(220.55deg, #00E0EE 0%, #AD00FE 100%)',
  'linear-gradient(220.55deg, #D0004B 0%, #88069D 100%)',
  'linear-gradient(220.55deg, #FF8570 0%, #418CB7 100%)',
  'linear-gradient(220.55deg, #B9A14C 0%, #000000 100%)',
]
export function GradientChecker({children}) {
    const [index, setIndex] = useState(0)
  return (
    <div style={{background: gradients[index]}}>
      {children}
      <div style={{position: 'absolute', bottom: 0, right: 0, padding: '10px'}}>
        <button className="px-3 py-2 bg-black text-white" onClick={() => setIndex((index + 1) % gradients.length)}>Change Gradient</button>
      </div>
    </div>
  )

}