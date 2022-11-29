import prisma from '../prisma';

// Takes all the tasks of all the courses in which a user is enrolled, 
// except for those already submitted
export const getUserTasks = async (userId) => {

    const submissions = await prisma.submission.findMany({
        where: {
            userId: userId,
            isSubmitted: true,
        }
    });

    const res = await prisma.registration.findMany({
        where: {
            userId: userId,
        },
        include: {
            course: {
                include: {
                    tasks: {
                        where: {
                            id: { notIn: submissions.map((x) => x.taskId) }
                        }
                    }
                }
            }
        }

    });

    return res;
}

export const getTask = async (taskId) => {
    const res = await prisma.task.findUnique({
        where: {
            id: taskId,
        }
    });

    return res;
}

export const getProfOngoingTask = async (userId) => {
    const res = await prisma.course.findMany({
        where: {
            userId: userId,
        },
        include: {
            user: {
                select: {
                    name: true,
                    lastName: true,
                    username: true,
                }
            },
            tasks: {
                include: {
                    submissions: {
                        where: {
                            isSubmitted: true,
                        }
                    },
                },

            },
        }
    });

    return res;
}

export const createTask = async (task) => {
    const res = await prisma.task.create({
        data: task,
    });
    return res;
}

export const deleteTask = async (taskId) => {
    const res = await prisma.task.delete({
        where: {
            id: taskId,
        }
    });
    return res;
}

export const updateTask = async (task) => {
    const res = await prisma.task.update({
        where: {
            id: task.id,
        },
        data: {
            title: task.title,
            assignment: task.assignment,
            deadline: task.deadline,
            testCase: task.testCase,
            hint: task.hint,
            solution: task.solution,
            language: task.language,

        }
    });

    return res;
}

