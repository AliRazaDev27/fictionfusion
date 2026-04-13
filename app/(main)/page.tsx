import ScrollToTop from "@/components/scroll_to_top"
import BentoGrid from "../../components/bento-grid"
import HeroSection from "@/components/hero"
import Footer from "@/components/footer"
import NeuralStream from "../../components/neural_stream"

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
