import { getCelebUrl, extractRealTimeWorkInfo } from "@/actions/celebActions";

interface Film {
  year: string;
  title: string;
  episodes: string;
  role: string;
  rating: string;
}

interface FilmData {
  [category: string]: Film[];
}

export default async function Page({ params }) {
  const { id } = await params;
  const url = await getCelebUrl(Number(id));
  
  if (!url) {
    return (
      <div className="flex min-h-[90vh] flex-col items-center justify-center ">
        <h1 className="text-white">Celebrity not found</h1>
      </div>
    );
  }

  const response: FilmData = await extractRealTimeWorkInfo(url);

  return (
    <div className="container mx-auto p-4 text-white">
      <h1 className="text-3xl font-bold mb-4">Filmography</h1>
      <div className="space-y-8">
        {Object.keys(response).map((category) => (
          <div key={category}>
            <h2 className="text-2xl font-semibold border-b-2 border-gray-700 pb-2 mb-4">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {response[category].map((film, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                  <h3 className="text-xl font-bold">{film.title}</h3>
                  <p className="text-gray-400">{film.year}</p>
                  <p>Role: {film.role}</p>
                  <p>Episodes: {film.episodes}</p>
                  <p>Rating: {film.rating}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
