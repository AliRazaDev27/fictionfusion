import { extractRealTimeWorkInfo, getCelebInfo } from "@/actions/celebActions";
import { WorkList } from "../workList";
import { WorksListTMDB} from "../WorksListTMDB"
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
  if(info.source === "MDL"){
  const response: {data:FilmData, info:{nationality:string, gender:string, age:string}} = await extractRealTimeWorkInfo(info?.url);
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
      }/>
    </div>
  );
  }
  if(info.source === "TMDB"){
    return(
      <WorksListTMDB id={Number(info.url)}/>
    )
  }

}
