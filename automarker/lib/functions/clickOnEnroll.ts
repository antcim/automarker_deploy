import { toast } from "react-toastify";

export const clickOnEnroll = async (e, router, userId) => {

    const body = {
        courseId: e.currentTarget.id.replace("button", ""),
        userId: userId,
    }

    try {
        const res = await fetch("/api/user/enrollment/enroll", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (res.status === 200) {
            toast.success("Enrollment successful 🙌🎉", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            router.push("/user/profile");

        } else {
            toast.error("Something went wrong during enrollment 😵", {
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
        toast.error("An unexpected error happened occurred", {
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