export const clickOnCourse = async (e, router) => {
    router.push("/user/courses/" + e.currentTarget.id);
}