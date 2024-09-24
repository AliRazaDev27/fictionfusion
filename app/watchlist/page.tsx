import { getIgnoreList } from "@/actions/ignorelistActions";
import { getWatchlist } from "@/actions/watchlistActions";
import MyDramaShowCard from "@/components/mydramaShowCard";

export default async function Page() {
    let a = performance.now();
    let data:any = []
    const [ignoreList,result] = await Promise.all([getIgnoreList(),getWatchlist("https://mydramalist.com/shows/top?page=1")])
    if(ignoreList.success === true){
        data = result.filter((item:any)=>!ignoreList?.items?.includes(item.title))
    }
    else{
        data = result
    }
    console.log("time taken", performance.now() - a);
    return(
        <div className="w-full grid grid-cols-4 gap-4 px-4 py-4:">
        {data.map((item:any,index:number)=>(
            <MyDramaShowCard key={item.title} item={item}/>
        ))}
        </div>
    )
}
