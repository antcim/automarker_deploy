import { toast } from "react-toastify";

export const clickOnDeleteProfessor = async(router, professorId) =>{
    const body = {
        id: professorId,
    }

    console.log(JSON.stringify(body));
    try{
        const res = await fetch("/api/admin/professors/deleteProfessor", {
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify(body),
        });

        if (res.status === 200){
            toast.success("Professor deleted successfully", {
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
            toast.error("Something went wrong during the elimination of the professor 😵", {
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