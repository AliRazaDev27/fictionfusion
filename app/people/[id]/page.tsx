import { extractRealTimeWorkInfo } from "@/actions/celebActions";

export default async function Page({ params }: any) {
  const {id} = await params
  const response = await extractRealTimeWorkInfo(Number(id))
  console.log(response)
  return (
    <div className="flex min-h-[90vh] flex-col items-center justify-center ">
      <h1 className="text-white">{id}</h1>
    </div>
  );
}