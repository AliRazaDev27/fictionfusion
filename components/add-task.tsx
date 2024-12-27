import { useRef, useState, useActionState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { AddTaskToDB } from "@/actions/taskActions"

export function AddTask() {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [open, setOpen] = useState(false)
    const [openTask, setOpenTask] = useState(false)
    const taskTime = useRef<Date>(null)
    const [state, formAction, pending] = useActionState(AddTaskToDB, {message: ""})
    const showPickedDate = (newSelected:Date) =>{
        console.log(newSelected.toDateString(),new Date().toDateString())
        setOpen(false)
        setOpenTask(true)
        taskTime.current = newSelected;
    }
    return (
        <>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="text-white/60 hover:text-orange-500 text-nowrap transition-colors duration-100">Add Task</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Calender</DialogTitle>
                    <DialogDescription>
Choose a date to add a task.
                    </DialogDescription>
                </DialogHeader>
                <div className="mx-auto w-fit border flex justify-center items-center">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={showPickedDate}
                        className="rounded-md border"
                        required
                    />
                </div>
            </DialogContent>
        </Dialog>

        <Dialog open={openTask} onOpenChange={setOpenTask}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Task Info</DialogTitle>
                    <DialogDescription> 
                        { state?.message &&
                        <p className="bg-red-600 text-white p-4 rounded-md">
                        {state?.message}
                        </p>
                        }
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction} className="flex flex-col gap-3">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="taskName" className="">Task Name</label>
                                <input type="text" id="taskName" name="taskName" required className="outline-dotted  outline-1 rounded-md p-2 border border-white" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="taskDesc" className="">Task Description</label>
                                <textarea id="taskDesc" name="taskDesc" required className="outline-dotted  outline-1 rounded-md p-2 border border-white" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label htmlFor="taskTime" className="">Task Time</label>
                                <input type="text" readOnly id="taskTime" name="taskTime" value={taskTime?.current?.toDateString()}  className="outline-none font-semibold hover:cursor-not-allowed rounded-md p-2 border border-white" />
                            </div>
                            <div className="flex justify-end items-center">
                                <button className=" bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-red-600 disabled:hover:cursor-not-allowed" disabled={pending}>Save</button>
                            </div>
                        </form>
            </DialogContent>
        </Dialog>
        </>
    )
}