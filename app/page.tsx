"use client"
import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { BookOpen, Film, Tv, ChevronDown } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [activeFeature, setActiveFeature] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col min-h-screen  text-white">
      <main className="flex-grow flex flex-col items-center justify-center p-8 text-center mt-16">
        <h1 className="text-5xl font-bold mb-6 animate-fade-in-down">
          Discover <span className="text-[#f97316]">Organize</span> Track
        </h1>
        <p className="text-xl mb-8 animate-fade-in-up">All your favorite books, movies and shows in one place</p>
        
      

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 w-full max-w-4xl">
          {[
            { icon: <BookOpen className="h-10 w-10" />, title: "Books", description: "Discover new worlds through literature", linkTo:"/books" },
            { icon: <Film className="h-10 w-10" />, title: "Movies", description: "Experience cinematic masterpieces", linkTo:"/movies" },
            { icon: <Tv className="h-10 w-10" />, title: "Shows", description: "Binge-watch your favorite series", linkTo:"/shows" },
          ].map((feature, index) => (
            
            <FeatureCard 
              key={feature.title} 
              {...feature} 
              isActive={activeFeature === index}
            />
           
          ))}
        </div>

        <Button className="bg-[#f97316] hover:bg-[#ea580c] text-lg py-6 px-8 rounded-full transition-all duration-300 transform hover:scale-105 ">
          <Link href="/login">Get Started</Link>
        </Button>

        <div className="mt-16 animate-bounce">
         <button onClick={()=>window.scrollTo({top: 500, behavior: 'smooth'})}><ChevronDown className="h-8 w-8 text-[#f97316]" /></button>
        </div>
      </main>

      <section className="py-16  backdrop-blur-lg">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Why Choose FictionFusion?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Extensive Database", description: "Access millions of books, movies, and shows" },
              { title: "Personalized Recommendations", description: "Discover new content tailored to your tastes" },
              { title: "Track Your Progress", description: "Keep tabs on what you've watched and read" }
            ].map((feature) => (
              <div key={feature.title} className="p-6 bg-white/10 rounded-lg transition-all duration-300 hover:bg-white/20 hover:transform hover:scale-105">
                <h3 className=" text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-neutral-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="p-4 text-center text-sm">
        <div className="container mx-auto">
          <p>© 2023 <span className="font-semibold text-[#f97316]">FictionFusion</span>. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, isActive, linkTo}: { icon: React.ReactNode; title: string; description: string; isActive: boolean, linkTo?: string }) {
  return (
    <div className={`flex flex-col items-center p-6 rounded-lg transition-all duration-300 transform ${isActive ? 'bg-[#f97316] scale-105' : 'bg-[#2a4a9e] hover:bg-[#3a5abe]'}`}>
      {icon}
      {linkTo ? <Link href={linkTo} className='underline underline-offset-4 decoration-2 hover:no-underline  hover:bg-black hover:text-white rounded-full px-4 py-2 mt-1 transition-colors duration-500'>{title}</Link>: <h2 className="mt-4 text-xl font-semibold">{title}</h2>}
      <p className="mt-2 text-sm text-neutral-300">{description}</p>
    </div> 
  )
}