export const clickOnTask = async (router, userId, taskId) => {
    router.push("/user/task/" + userId + "/" + taskId);
}