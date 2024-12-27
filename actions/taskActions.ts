"use server";
import { auth } from "@/auth";
import { db } from "@/lib/database";
import { NewTask, TaskTable } from "@/lib/database/taskSchema";
export async function AddTaskToDB(prevState: any, formData: FormData) {
    const taskName = formData.get("taskName");
    const taskDesc = formData.get("taskDesc");
    const taskTime = formData.get("taskTime");
    if (!taskName || !taskDesc || !taskTime) {
        return {message: "Please fill all the fields."};
    }
    const session:any = await auth();
    const role = session?.user?.role || "VISITOR";
    if (role === "VISITOR") {
        return {message: "Please login to add a task."};
    }
    const newTask: NewTask = {
        taskName: taskName.toString(),
        taskDesc: taskDesc.toString(),
        taskTime: taskTime.toString(),
    };
    await db.insert(TaskTable).values(newTask);
    return {message: "Task added successfully."};
}

export async function ViewAllTasks(){
    const session:any = await auth();
    const role = session?.user?.role || "VISITOR";
    if (role === "VISITOR") {
        return {message: "Please login to view tasks."};
    }
    const tasks = await db.select().from(TaskTable)
    return {tasks, message: "Tasks fetched successfully."};
}