export default function Loader() {
  return (
    <header className="top-0 relative z-50 flex justify-between h-[70px] items-center  bg-trasparent px-4 md:px-6">
      <div className="hidden md:block">
        <span
          className="text-xl md:text-2xl italic text-white"
        >
          Fiction<span className="text-orange-500 text-3xl">Fusion</span>
        </span>
      </div>

      <nav className="hidden text-lg font-medium md:flex md:flex-row md:items-center md:gap-4">
        <div className="relative group cursor-pointer px-1 py-3">
          <p className="text-white/60 text-xl">Track</p>
        </div>
        <div className="relative group cursor-pointer px-1 py-3">
          <p className="text-white/60 text-xl">Explore</p>
        </div>
        <div className="relative group cursor-pointer px-1 py-3">
          <p className="text-white/60 text-xl">Tasks</p>
        </div>
      </nav>

      <div className="relative flex  items-center gap-1  md:gap-2 lg:gap-4">
        <span
          className="px-4 py-2 rounded-full bg-slate-700 hover:bg-slate-800 text-white">
          Login
        </span>
      </div>
    </header>
  )
}