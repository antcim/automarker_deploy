import { toast } from "react-toastify";


export const clickOnDeleteTask = async (e, taskId, router) => {

    if(confirm("Clicking OK will cancel the Task and all related Submissions. Are you sure?")){
        const body = {
            taskId: taskId,
        }
    
        fetch("/api/prof/task/delete", {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify(body),
        })
        .then((res) => {
            if(res.status === 200){
                toast.success("Task deleted successfully", {
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
    
                router.push("/");
    
            } else {
                toast.error("Non-existent Task or error while deleting", {
                    position: "top-right",
                    autoClose: 2500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            }
        });
    } else {
        return;
    }


    
}