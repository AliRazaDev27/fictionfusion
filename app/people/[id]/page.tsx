import { extractRealTimeWorkInfo, getCelebInfo } from "@/actions/celebActions";
import { WorkList } from "../workList";
import { FilmData } from "@/lib";

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
  const response: FilmData = await extractRealTimeWorkInfo(info?.url);
  // console.log(response);

  return (
    <div className="container mx-auto p-4 text-white">
      <div className="flex items-center gap-4">
        <img src={info.avatar || ""} alt={info.title} className="w-32 h-32 rounded-full mb-4" />
        <h1 className="text-3xl font-bold">{info.title}</h1>
      </div>
      <WorkList id={id} workInfo={response} ignoredTitles={info.ignoredTitles!} />
    </div>
  );
}
