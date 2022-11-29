import { toast } from "react-toastify";

export const clickOnUnenroll = async (router, registrationId) => {

    const body = {
        registrationId: registrationId,
    }

    try {
        const res = await fetch("/api/user/enrollment/unenroll", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (res.status === 200) {
            
            toast.success("Unenrollment successful 👋", {
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

        } else {
            toast.error("Something went wrong during unenrollment 😵", {
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
    } catch (error) {
        console.error("An unexpected error happened occurred:", error);
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