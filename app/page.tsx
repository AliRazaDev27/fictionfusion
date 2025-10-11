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
      {/* Hero Section */}
      <section className="container mx-auto px-4 lg:px-8 py-8 sm:py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-4">
          {/* Left Content */}
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="secondary"
                  className="bg-emerald-900/50 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 px-3 py-1"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI-Powered Discovery
                </Badge>
                <Badge variant="secondary" className="bg-blue-900/50 hover:bg-blue-900 text-blue-300 border border-blue-700 px-3 py-1">
                  <Users className="w-3 h-3 mr-1" />
                  Web Scrappers
                </Badge>
              </div>

              <h1 className="text-4xl lg:text-6xl font-semibold text-white leading-tight">
                <del className="italic font-normal text-3xl lg:text-5xl line-through decoration-wavy decoration-red-500">Your</del> My Complete <span className="text-emerald-400">Entertainment</span>
                <br />
                <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  Intelligence Hub
                </span>
              </h1>

              <p className="text-xl text-stone-300 leading-relaxed">
                Discover, track, and organize your favorites with AI recommendations, powerful search, and real-time updates for books, movies, TV shows, and music.
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-stone-400">
                  <Brain className="w-4 h-4 text-emerald-400" />
                  <span>Smart AI Recommendations</span>
                </div>
                <div className="flex items-center gap-2 text-stone-400">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>Organize Your Favorites</span>
                </div>
                <div className="flex items-center gap-2 text-stone-400">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  <span>Advanced Search</span>
                </div>
                <div className="flex items-center gap-2 text-stone-400">
                  <Globe className="w-4 h-4 text-orange-400" />
                  <span>Real-time Updates</span>
                </div>
              </div>
            </div>

            <div className="w-fit max-md:mx-auto mt-8 md:mt-4">
              <Link
                href="/login"
                prefetch={false}
                className="flex items-center justify-center gap-2 rounded-4xl bg-gradient-to-r from-emerald-700 to-teal-600 hover:from-emerald-600 hover:to-teal-500 hover:text-neutral-300 text-white px-10 py-4 text-lg font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                <Monitor className="w-5 h-5 mr-2" />
                Go Inside!
              </Link>
            </div>

          </div>
          <div className="flex flex-col items-center justify-center gap-8">
            <div className="space-y-2">
              <p className="text-4xl font-bold text-center bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">The Best Stories Ever Told</p>
              <p className="text-xl font-semibold text-white text-center">From timeless classics to trending hits</p>
            </div>
            <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-2 lg:gap-4">
              {
                data.map((item, index) => (
                  <div key={index} className="flex flex-col items-center justify-between rounded-2xl overflow-hidden bg-gray-800">
                    <div className="w-full aspect-[0.66] bg-gray-800 relative overflow-hidden">
                      {/* <img src={item.image} alt={item.title} className="w-full h-full" /> */}
                      <Image src={item.image} alt={item.title} fill={true} sizes="100%" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-full bg-stone-700 hover:bg-emerald-600 transition-colors duration-200">
                      <Link href={item.url} prefetch={false} className="inline-block  w-full py-2  text-center">
                        <p className="text-white font-medium text-base text-nowrap">{item.title}</p>
                        <p className="text-neutral-300 text-sm text-nowrap">{item.genre} - {item.year}</p>
                      </Link>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features Grid */}
      <section className="container mx-auto px-4 sm:px-8 py-4 sm:py-8 mt-6 sm:mt-2">
        <div className="text-center py-4">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Powerful Features for <span className="text-emerald-400">Every Media Enthusiast</span>
          </h2>
          <p className="text-xl text-stone-300 max-w-3xl mx-auto">
            From AI-powered recommendations to advanced search apis, FictionFusion provides professional-grade tools for
            managing your entertainment universe.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* AI & Machine Learning */}
          <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-stone-800 border border-emerald-700">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">AI-Powered Recommendations</h3>
            <p className="text-stone-300 mb-4">
              Google Gemini AI analyze your preferences, reading patterns, and viewing habits to
              deliver personalized recommendations with 95%+ accuracy.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-stone-400">
                <Sparkles className="w-3 h-3" />
                <span>Mood-based recommendations</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-400">
                <Target className="w-3 h-3" />
                <span>Predictive content scoring</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-400">
                <TrendingUp className="w-3 h-3" />
                <span>Trend analysis & forecasting</span>
              </div>
            </div>
          </Card>

          {/* Social & Community */}
          <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-stone-800 border border-blue-700">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">Multiple Search Apis</h3>
            <p className="text-stone-300 mb-4">
              FictionFusion supports multiple external search apis, including IMDb, TMDB, TvMaze, OpenLibrary, Itunes,and more.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-stone-400">
                <MessageCircle className="w-3 h-3" />
                <span>
                  Wide range of content sources
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-400">
                <Share2 className="w-3 h-3" />
                <span>Seamless integration with external apis</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-400">
                <Award className="w-3 h-3" />
                <span>Expendable support for more apis</span>
              </div>
            </div>
          </Card>

          {/* Advanced Analytics */}
          <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-stone-800 border border-purple-700">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">Performant Web Scrappers</h3>
            <p className="text-stone-300 mb-4">
              Provides real-time on-demand web scrapping capabilities, ensuring your content is always up to date.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-stone-400">
                <Clock className="w-3 h-3" />
                <span>Currenlty supports imdb & mydramalist</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-400">
                <TrendingUp className="w-3 h-3" />
                <span>Fast and reliable updates on demand</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-400">
                <Database className="w-3 h-3" />
                <span>Saves you time and effort tracking your content</span>
              </div>
            </div>
          </Card>

          {/* Smart Organization */}
          <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-stone-800 border border-orange-700">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
              <List className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">Smart Organization System</h3>
            <p className="text-stone-300 mb-4">
              Advanced tagging, custom collections, smart filters, and automated categorization. Create dynamic lists
              that update based on your criteria and preferences.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-stone-400">
                <Tags className="w-3 h-3" />
                <span>Advanced tagging system</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-400">
                <Filter className="w-3 h-3" />
                <span>Smart filters & search</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-400">
                <BookmarkPlus className="w-3 h-3" />
                <span>Custom collections</span>
              </div>
            </div>
          </Card>

          {/* Cross-Platform Sync */}
          <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-stone-800 border border-cyan-700">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">Feature Rich Music Player</h3>
            <p className="text-stone-300 mb-4">
              Custom music player with advanced playback controls, playlist management, and more.
              Parallel multi file uploads on Cloudinary with automatic metadata from Itunes api.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-stone-400">
                <Smartphone className="w-3 h-3" />
                <span>Built for performance</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-400">
                <Monitor className="w-3 h-3" />
                <span>Fully responsive design</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-400">
                <Database className="w-3 h-3" />
                <span>Smooth UX and UI, easy to use</span>
              </div>
            </div>
          </Card>

          {/* Goal Setting & Gamification */}
          <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:scale-105 bg-stone-800 border border-pink-700">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">Goals & Achievements</h3>
            <p className="text-stone-300 mb-4">
              Set reading goals, track streaks, earn achievements, and participate in challenges. Gamified experience
              that motivates and rewards your progress.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-stone-400">
                <Calendar className="w-3 h-3" />
                <span>Custom goal setting</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-400">
                <Award className="w-3 h-3" />
                <span>Achievement system</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-stone-400">
                <TrendingUp className="w-3 h-3" />
                <span>Progress tracking</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Movies Feature Section */}
      <section className="container mx-auto px-4 sm:px-8 py-4 sm:py-8">
        <div className="p-4 border border-stone-700 rounded-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="hidden w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl sm:flex items-center justify-center">
              <Film className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-white">Movies</h2>
              <p className="text-lg md:text-xl text-stone-300">Comprehensive movie management with advanced categorization</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-stone-800 border border-stone-700 bg-top">
              <div className="relative">
                <img
                  src="https://image.tmdb.org/t/p/w342/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg"
                  alt="The Shawshank Redemption movie poster"
                  className="w-full h-72 object-cover object-[0_20%]"
                  loading="lazy"
                />
                <Badge className="absolute top-4 left-4 bg-blue-600 text-white">Drama</Badge>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-white">The Shawshank Redemption</h3>
                <p className="text-stone-300 text-sm">
                  Thrilling story of a man who escapes prison and embarks on a new life
                </p>
              </div>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-stone-800 border border-stone-700">
              <div className="relative">
                <img
                  src="https://image.tmdb.org/t/p/w342/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg"
                  alt="The Lord of the Rings movie poster"
                  className="w-full h-72 object-cover object-[0_37%]"
                  loading="lazy"
                />
                <Badge className="absolute top-4 left-4 bg-red-600 text-white">Fantasy</Badge>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-white">The Lord of the Rings</h3>
                <p className="text-stone-300 text-sm">
                  Epic quest to destroy the One Ring and vanquish Sauron
                </p>
              </div>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-stone-800 border border-stone-700">
              <div className="relative">
                <img
                  src="https://image.tmdb.org/t/p/w342/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg"
                  alt="Intersteller movie poster"
                  className="w-full h-72 object-cover object-[0_27%]"
                  loading="lazy"
                />
                <Badge className="absolute top-4 left-4 bg-purple-600 text-white">Sci-fi</Badge>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-white">Intersteller</h3>
                <p className="text-stone-300 text-sm">
                  A team of explorers travel through a wormhole in space
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* TV Shows Feature Section */}
      <section className="container mx-auto px-4 sm:px-8 py-4 sm:py-8 ">
        <div className="p-4 border border-stone-700 rounded-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="hidden sm:flex w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl  items-center justify-center">
              <Tv className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-white">TV Show</h2>
              <p className="text-lg md:text-xl text-stone-300">Track episodes, seasons, and binge-watching progress</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-stone-800 border border-stone-700">
              <div className="relative">
                <img
                  src="https://static.tvmaze.com/uploads/images/medium_portrait/69/174608.jpg"
                  alt="Nirvana in Fire"
                  className="w-full h-72 object-cover object-[0_60%]"
                  loading="lazy"
                />
                <Badge className="absolute top-4 left-4 bg-orange-600 text-white">Revenge</Badge>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-white">Nirvana in Fire</h3>
                <p className="text-stone-300 text-sm">Thrilling revenge thriller following a family&aposs secrets</p>
              </div>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-stone-800 border border-stone-700">
              <div className="relative">
                <img
                  src="https://static.tvmaze.com/uploads/images/medium_portrait/61/152818.jpg"
                  alt="The Sopranos"
                  className="w-full h-72 object-cover object-[0_40%]"
                  loading="lazy"
                />
                <Badge className="absolute top-4 left-4 bg-green-600 text-white">Mafia</Badge>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-white">The Sopranos</h3>
                <p className="text-stone-300 text-sm">The story of a mafia family in New York City</p>
              </div>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-stone-800 border border-stone-700">
              <div className="relative">
                <img
                  src="https://static.tvmaze.com/uploads/images/medium_portrait/83/207960.jpg"
                  alt="Seinfeld"
                  className="w-full h-72 object-cover object-[0_50%]"
                  loading="lazy"
                />
                <Badge className="absolute top-4 left-4 bg-pink-600 text-white">Comedy</Badge>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-white">Seinfeld</h3>
                <p className="text-stone-300 text-sm">Comedy series about a group of friends in New York</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Books Feature Section */}
      <section className="container mx-auto px-4 sm:px-8 py-4 sm:py-8">
        <div className="p-4 border rounded-2xl border-stone-700">
          <div className="flex items-center gap-4 mb-8 ">
            <div className="hidden sm:flex w-8 h-8 md:w-16 md:h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl  items-center justify-center">
              <BookOpen className="w-4 h-4 md:w-8 md:h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-white">Book Library</h2>
              <p className="text-lg md:text-xl text-stone-300">Advanced reading tracking with progress analytics</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-stone-800 border border-stone-700">
              <div className="relative">
                <img
                  src="https://m.media-amazon.com/images/I/91GoCrV6emL._UF1000,1000_QL80_.jpg"
                  alt="100 Years of Solitude cover"
                  className="w-full h-96 object-contain"
                  loading="lazy"
                />
                <Badge className="absolute top-4 left-4 bg-blue-600 text-white">Saga</Badge>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-white">100 Years of Solitude</h3>
                <p className="text-stone-300 text-sm">
                  A family&aposs magical journey through the Spanish Civil War
                </p>
              </div>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-stone-800 border border-stone-700">
              <div className="relative">
                <img
                  src="https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327144697i/3744438.jpg"
                  alt="Nineteen Eighty-Four cover"
                  className="w-full h-96 object-contain "
                  loading="lazy"
                />
                <Badge className="absolute top-4 left-4 bg-rose-600 text-white">Dystopia</Badge>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-white">1984</h3>
                <p className="text-stone-300 text-sm">A dystopian novel about a totalitarian society</p>
              </div>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-stone-800 border border-stone-700">
              <div className="relative">
                <img
                  src="https://images.thegreatestbooks.org/0peqiiwiftf1vax30skf1xq165x0"
                  alt="Wuthering Heights cover"
                  className="w-full h-96 object-contain"
                  loading="lazy"
                />
                <Badge className="absolute top-4 left-4 bg-yellow-600 text-white">Tragedy</Badge>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-white">Wuthering Heights</h3>
                <p className="text-stone-300 text-sm">A classic novel about a family&aposs struggle for survival</p>
              </div>
            </Card>
          </div>
        </div>
      </section>
      {/* Enhanced CTA Section */}
      <section className="container  mx-auto px-4 sm:px-8 py-4 sm:py-8">
        <Card className="px-6 py-6 text-center bg-stone-900/50 border border-stone-700 shadow-2xl">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-white mb-6">
              A Personal Entertainment Hub
              <span className="block text-emerald-400">Built for Media Enthusiasts</span>
            </h2>
            <p className="text-xl text-stone-300 mb-8 max-w-3xl mx-auto">
              A comprehensive personal project showcasing advanced media tracking capabilities, AI-powered
              recommendations, and sophisticated data management for books, movies, TV shows, and music.
            </p>

            <div className="mb-12 flex items-center justify-center">
              <Link
                href="https://github.com/AliRazaDev27/fictionfusion"
                prefetch={false}
                className="flex justify-center text-nowrap w-fit items-center bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white px-3 py-3 text-base md:text-lg font-semibold transition-all duration-300 hover:shadow-2xl hover:scale-105"
              >
                <BookOpen className="w-6 h-6 mr-3 hidden sm:block" />
                View on Github
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-emerald-400 mb-2">Open Source</div>
                <div className="text-stone-400">Personal Project</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">Full Stack</div>
                <div className="text-stone-400">Next.js & TypeScript</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">AI Powered</div>
                <div className="text-stone-400">Smart Features</div>
              </div>
            </div>
          </div>
        </Card>
      </section>
      <footer className="p-4 text-center text-sm text-white">
        <div className="container mx-auto">
          <p>© 2023 <span className="font-semibold text-[#f97316]">FictionFusion</span>. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
