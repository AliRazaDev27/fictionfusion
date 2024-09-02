export default async function Home() {
  return (
    <main className="flex flex-col md:flex-row min-h-[90vh]  items-center justify-between">
        <div className="relative  aspect-square flex flex-col  justify-center items-center  px-4 py-4">
        <h1 className="text-4xl font-semibold text-orange-500">Discover Organize Track</h1>
        <p>All your favorite books,movies and shows</p>
        <button className="px-6 py-2 border border-current rounded-3xl bg-orange-600 text-white  font-semibold hover:bg-orange-800">Login</button>
        
        </div>
        <div className="w-1/2 flex justify-center items-center  ">
        <div className="relative rounded-full animate-[spin_10s_linear_infinite_forwards]  hover:animate-none  w-1/3 aspect-square" style={{animationFillMode:"backwards"}}>
<div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
<div className="size-32 animate-[spin_10s_linear_infinite_reverse]  rounded-full overflow-hidden ">
    <img src="/movie.png" className="bg-cover rotate-[90deg]"/>
    </div>
</div>
<div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 ">
<div className="size-32 animate-[spin_10s_linear_infinite_reverse] rounded-full overflow-hidden">
    <img src="/show.png" className="bg-cover -rotate-[90deg]"/>
    </div>

</div>
<div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2">
  <div className="size-32 animate-[spin_10s_linear_infinite_reverse] rounded-full overflow-hidden">
    <img src="/book.png" className="bg-cover -rotate-[90deg]"/>
    </div>
    </div>
        </div>
        </div>
      </main>
  );
}
