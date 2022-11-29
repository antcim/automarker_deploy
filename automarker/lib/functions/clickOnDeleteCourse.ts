import { toast} from "react-toastify";

export const clickOnDeleteCourse = async(router, courseId) =>{

    const body = {
        courseId: courseId,
    }

    try{
        const res = await fetch("/api/admin/courses/deleteCourse", {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify(body),
        });

        if(res.status === 200){
            toast.success("Course deleted successfully", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });

            router.push("/");
        }
        else{
            toast.error("Something went wrong during the elimination of the course 😵", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        }
    }catch(error){
        console.error("An unexpected error occurred: ", error);
        toast.error("An unexpected error happened occurred (see console)", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
        });
    }
}