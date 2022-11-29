import { toast } from "react-toastify";


export const clickOnUpdateTask = async (e, taskId, router) => {

    router.push("/prof/tasks/update/" + taskId);

    
}