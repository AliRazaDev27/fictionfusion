export function WorkCard({
  id,
  title,
  image,
  character,
  type,
  rating,
  releaseDate,
  summary
}: {
  id: number;
  title: string;
  image: string;
  character: string;
  type: string;
  rating: string;
  releaseDate: string;
  summary: string;
}){
  return (
  <div className="group relative w-full max-w-sm overflow-hidden rounded-2xl bg-zinc-900 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20">
      {/* Image Container */}
      <div className="relative h-80 w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Top Badges */}
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-lg bg-black/60 px-2 py-1 text-xs font-semibold text-white backdrop-blur-md uppercase tracking-wider">
            {type}
          </span>
        </div>
        
        {/* Rating Badge */}
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-lg bg-yellow-500/90 px-2 py-1 text-xs font-bold text-black shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
          </svg>
          {rating}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white line-clamp-1">{title}</h3>
          <span className="text-xs text-slate-400">{new Date(releaseDate).getFullYear()}</span>
        </div>

        <p className="mb-3 text-sm font-medium text-blue-400">
          As <span className="italic">{character}</span>
        </p>

        <p className="line-clamp-3 text-sm leading-relaxed text-slate-400">
          {summary}
        </p>

        {/* Action Button (Optional) */}
        <button className="mt-5 w-full rounded-xl bg-white/10 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-black">
          View Details
        </button>
      </div>
    </div>
  );
}