export const clickOnUpdateCourse = async (router, courseId) => {
    router.push("/admin/courses/update/" + courseId);
}