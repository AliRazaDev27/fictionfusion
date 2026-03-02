import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Film,
  Tv,
  Music,
  Heart,
  List,
  BarChart3,
  Users,
  Target,
  Globe,
  Star,
  TrendingUp,
  Calendar,
  BookmarkPlus,
  Share2,
  MessageCircle,
  Award,
  Brain,
  Sparkles,
  Clock,
  Filter,
  Tags,
  Database,
  Smartphone,
  Monitor,
} from "lucide-react"
import Link from "next/link"
import ScrollToTop from "@/components/scroll_to_top"
import BentoGrid from "../../components/bento-grid"
import HeroSection from "@/components/hero"
import Footer from "@/components/footer"
import NeuralStream from "../../components/neural_stream"

const data = [
  {
    title: "The Godfather",
    image: "https://image.tmdb.org/t/p/w342/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    url: "/movies",
    genre: "Movie",
    year: "1972",
  },
  {
    title: "Ezel",
    image: "https://static.tvmaze.com/uploads/images/medium_portrait/30/75370.jpg",
    url: "/shows",
    genre: "Show",
    year: "2009",
  },
  {
    title: "The Trial",
    image: "https://images.thegreatestbooks.org/x7f0kn2gniao6kenq1mkm0soi884",
    url: "/books",
    genre: "Book",
    year: "1913",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen w-full overflow-hidden" style={{ backgroundColor: "#1c1917" }}>
    <ScrollToTop />
    <HeroSection/>
    <NeuralStream/>
    <BentoGrid/>
    <Footer/>
    </div>
  )
}
