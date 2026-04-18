import { extractRealTimeWorkInfo, getCelebInfo } from "@/actions/celebActions";
import { WorkList } from "../workList";
import { FilmData } from "@/lib";
import { WorkCard } from "./workCard";
import { getWorksByPersonIdFromTvMaze } from "@/lib/tvMaze";
import { getPersonWorksFromTMDBById } from "@/actions/movieActions";

export default async function Page({ params }) {
  const { id } = await params;
  const info = await getCelebInfo(Number(id));
  if (!info) {
    return (
      <div className="flex min-h-[90vh] flex-col items-center justify-center ">
        <h1 className="text-white">Celebrity not found</h1>
      </div>
    );
  }
  if (info.source === "MDL") {
    const response: { data: FilmData, info: { nationality: string, gender: string, age: string } } = await extractRealTimeWorkInfo(info?.url);
    return (
      <div className="container mx-auto p-4 text-white">
        <WorkList
          id={id}
          workInfo={response.data}
          ignoredTitles={info.ignoredTitles!}
          favouritedTitles={info.favouritedTitles!}
          extraInfo={
            {
              title: info.title,
              avatar: info.avatar!,
              nationality: response.info.nationality,
              gender: response.info.gender,
              age: response.info.age
            }
          } />
      </div>
    );
  }
  if (info.source === "TVMAZE-TMDB") {

      const promiseShow = getWorksByPersonIdFromTvMaze(Number(info.url.split('-')[0]));
      const promiseMovie = getPersonWorksFromTMDBById(Number(info.url.split('-')[1]));
      const [resultShow,resultMovie] = await Promise.all([promiseShow,promiseMovie]);
      console.log(resultMovie);
    return (
      <div className="px-4 py-4 space-y-8">
        {/* <WorksListTvMaze id={Number(info.url.split('-')[0])} /> */}
      {/* <WorksListTMDB id={Number(info.url.split('-')[1])} /> */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-teal-300">{info.title}</h1>
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-emerald-400">Shows</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
        {resultShow && resultShow.map((show) => (
          <WorkCard
          key={`Show-${show._embedded.show.id}`}
          id={show._embedded.show.id}
          title={show._embedded.show.name}
          image={show._embedded.show.image?.medium || ""}
          character={show._links.character.name}
          type="Show"
          rating={show._embedded.show.rating.average?.toString() || 'N/A'}
          releaseDate={show._embedded.show.premiered || 'N/A'}
          summary={show._embedded.show.summary || 'N/A'}
          />
        ))}
      </div>

      <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-emerald-400">Movies</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
        {resultMovie && resultMovie.cast.map((movie) => (
          <WorkCard
          key={`Movie-${movie.id}`}
          id={movie.id}
          title={movie.title??(movie as any).name}
          image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          character={movie.character}
          type="Movie"
          rating={movie.vote_average?.toString() || 'N/A'}
          releaseDate={movie.release_date || 'N/A'}
          summary={movie.overview || 'N/A'}
          />
        ))}
      </div>
      </div>
    )
  }
}
