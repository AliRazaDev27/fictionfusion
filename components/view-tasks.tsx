import { ViewAllTasks } from "@/actions/taskActions";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { IoRefreshCircle } from "react-icons/io5";
import { useEffect, useState } from "react";
import { Task } from "@/lib/database/taskSchema";

export function ViewTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const loadTasks = async() => {
        const result = await ViewAllTasks();
        if(result?.tasks){
            setTasks(result.tasks);
        }
    }
    useEffect(() => {
        const load = async() => {await loadTasks();}
        load();
    },[])
    return (
    <Dialog>
        <DialogTrigger className="text-white/60 hover:text-orange-500 text-nowrap transition-colors duration-100" onClick={() => {console.log(new Date())}}>View</DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Tasks</DialogTitle>
                <DialogDescription className="flex items-center gap-4">
                    Fetch latest tasks.
                    <button className="text-black hover:text-green-600 transition-all duration-500 hover:rotate-[360deg] hover:scale-110" onClick={loadTasks}>
        <IoRefreshCircle className="size-7"/>
                    </button>
                </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 overflow-y-auto">
                {tasks.map((task, index) => (
                    <div key={index} className="bg-gray-700 p-4 rounded-xl my-3">
                        <h1 className="text-[#FFD700] text-lg font-semibold">{task.taskName}</h1>
                        <p className="text-[#B0BEC5] font-medium">{task.taskDesc}</p>
                        <p className="text-[#B0BEC5] text-sm">{task.taskTime}</p>
                    </div>
                ))} 
            </div>
        </DialogContent>

    </Dialog>
    )
}