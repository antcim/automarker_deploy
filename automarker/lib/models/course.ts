import prisma from '../prisma';
import { v4 as uuidv4 } from "uuid";
import courseCardAdmin from '../../components/courseCardAdmin';


// All courses that contain the words "keyword".
// have to do a join with the user table to find the prof info
// have to do a join with the registrations table to find all registered users
export const findCourses = async (keyword) => {
    const res = await prisma.course.findMany({
        where: {
            name: {
                contains: keyword,
                mode: 'insensitive',
            },
        },
        include: {
            user: {
                select: {
                    name: true,
                    lastName: true,
                    username: true,
                }
            },
            registrations: true,
        }
    });
    return res;
}

// Return all courses
export const getAllCourses = async () => {
    const res = await prisma.course.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    lastName: true,
                    username: true,
                }
            },
            registrations: true,
            tasks: true,
        }
    });
    return res;
}

// Returns course information including tasks that were not submitted
export const getCourse = async (courseId, userId) => {

    const submissions = await prisma.submission.findMany({
        where: {
            userId: userId,
            isSubmitted: true,
        }
    });

    const res = await prisma.course.findUnique({
        where: {
            id: courseId,
        },
        include: {
            user: { // prof
                select: {
                    name: true,
                    lastName: true,
                    username: true,
                }
            },
            registrations: true,
            tasks: {
                where: {
                    id: { notIn: submissions.map((x) => x.taskId) }
                }
            }
        }
    });
    return res;
}

//create a new course (only the admin can do this)
export async function createCourse({ name, userId, academicYear }) {

    const course = {
        name,
        userId,
        academicYear,
    };

    await prisma.course.create({ data: course });
    return { name, userId };
}

//adding a professor to a course (only the admin can do this)
export const modifyCourse = async(courseId, userId, name, academicYear) => {
    console.log(courseId)
    const updateCourse = await prisma.course.update({
        where: {
            id: courseId,
        },
        data:{
            userId: userId,
            name: name,
            academicYear: academicYear,
        }
    });

    return updateCourse;
}

//delete a  course and everything related to it(only the admin can do this)
//to be done: implement the cascade delete method
export const deleteCourse = async (courseId) => {
    const deleteCourse = await prisma.course.delete({
        where: {
            id: courseId,
        },
    });

    return deleteCourse;
}

export async function getSingleCourse(courseId){
    const res = await prisma.course.findUnique({
        where:{
            id: courseId,
        }
    });

    return res;
}

export const getCourseUserNum = async (userId) => {
    const res = await prisma.course.findMany({
        where: {
            userId: userId,
        },
        include: {
            
            _count: {
                select: {
                    registrations: true,
                }
            }
        }

    });
    return res;
}

export const getOngoingCourseTask = async (userId) => {
    const res = await prisma.course.findMany({
        where: {
            userId: userId,
        },
        include: {


            tasks: {
                where: {
                    deadline: {
                        gt: Date.now().toString(),
                    }
                },

            },

        },

    });
    return res;
}