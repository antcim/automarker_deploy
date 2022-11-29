import { toast} from "react-toastify";

export const clickOnDeleteAdmin = async(router, adminId) =>{
    console.log(adminId);
    const body = {
        id: adminId,
    }

    console.log(JSON.stringify(body));
    try{
        const res = await fetch("/api/admin/administrator/deleteAdmin", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(body),
        });

        if(res.status === 200){
            toast.success("Administrator deleted successfully", {
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
            toast.error("Something went wrong during the elimination of the admin 😵", {
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
        console.error("An unexpected error occurred while deleting the admin: ", error);
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