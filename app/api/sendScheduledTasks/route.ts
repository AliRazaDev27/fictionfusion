import { sendEmail } from "@/actions/emailActions";
import { ViewAllTasks } from "@/actions/taskActions";

export async function GET() {
  const tasks = await ViewAllTasks();
  if(tasks.tasks && tasks.tasks.length > 0){
  for(const task of tasks.tasks){
      if(task.taskTime === new Date().toDateString()){
        await sendEmail(task.taskName,task.taskDesc);
      }
  }
  return new Response("Emails sent successfully.");
  }
  else{
    return new Response("No tasks found.");
  }
}