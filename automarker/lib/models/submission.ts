import courseCardAdmin from '../../components/courseCardAdmin';
import prisma from '../prisma';


export const getUserSubmissions = async (userId) => {

    const submissions = await prisma.submission.findMany({
        where: {
            userId: userId,
        },
        include: {
            task: {
                include: {
                    course: true,
                }
            }
        }
    });

    return submissions;
}


export const getUserCourseSubmissions = async (userId, courseId) => {

    const submissions = await prisma.registration.findFirst({
        where: {
            userId: userId,
            courseId: courseId,
        },
        include: {
            course: {
                include: {
                    tasks: {
                        where: {
                            courseId: courseId,
                        },
                        include: {
                            submissions: {
                                where: {
                                    userId: userId,
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    return submissions;
}

export const getTaskSubmissions = async (taskId) => {
    const submissions = await prisma.submission.findMany({
        where: {
            taskId: taskId,
            isSubmitted: true,
        },
        include: {
            user: {
                select: {
                    name: true,
                    lastName: true,
                    username: true,
                }
            },
            task: true,
        }
    });
    return submissions;
}

export const getUserTaskSubmission = async (userId, taskId) => {
    const submission = await prisma.submission.findFirst({
        where: {
            userId: userId,
            taskId: taskId,
        },
        include: {
            task: true,
            user: true,
        }
    });

    return submission;
}

export const mark = async (userId, taskId, mark) => {

    const res = await prisma.submission.findFirst({
        where: {
            userId: userId,
            taskId: taskId,
        }
    });

    const res2 = await prisma.submission.update({
        where: {
            id: res.id,
        },
        data: {
            mark: Number(mark),
        }
    });

    return res2;
}
