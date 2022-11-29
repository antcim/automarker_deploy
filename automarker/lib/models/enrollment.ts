import prisma from '../prisma';

// Enrolls the user in the course
export const enrollCourse = async (userId, courseId) => {

    const res = await prisma.registration.create({
        data: {
            userId: userId,
            courseId: courseId,
            createdAt: Date.now().toString(),
        }
    });
    return res;
}

export const unenrollCourse = async (registrationId) => {
    const res = await prisma.registration.delete({
        where: {
            id: registrationId,
        }
    });
    return res;
}

// Finds, if exists, the user's enrollment to the course
export const findEnrollment = async (userId, courseId) => {
    const res = await prisma.registration.findFirst({
        where: {
            userId: userId,
            courseId: courseId,
        },
    });
    return res;
}

// Return all user enrollments
export const getUserEnrollments = async (userId) => {
    const res = await prisma.registration.findMany({
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
            course: {
                include: {
                    user: true,
                }
            }
        }
    });
    return res;
}

