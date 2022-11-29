import { Role } from "@prisma/client";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import update from "../../pages/api/prof/task/update";

import prisma from '../prisma';

export async function createUser({ username, name, lastName, password }) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, "sha512")
        .toString("hex");

    const user = {
        id: uuidv4(),
        createdAt: Date.now().toString(),
        username,
        name,
        lastName,
        hash,
        salt,
    };

    await prisma.user.create({ data: user });
    return { username, createdAt: Date.now() };
}


export async function findUser({ username }) {
    const res = await prisma.user.findUnique({
        where: {
            username: username,
        },
    });
    return res;
}

export function validatePassword(user, inputPassword) {
    const inputHash = crypto
        .pbkdf2Sync(inputPassword, user.salt, 1000, 64, "sha512")
        .toString("hex");
    const passwordsMatch = user.hash === inputHash;
    return passwordsMatch;
}

export async function createProfessor({ username, name, lastName, password }) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");

    const user = {
        id: uuidv4(),
        createdAt: Date.now().toString(),
        username,
        name,
        lastName,
        hash,
        salt,
        role: Role.PROF,
    };

    await prisma.user.create({ data: user });
    return { username, createdAt: Date.now() };
}

export async function getAllProfessor() {
    const res = await prisma.user.findMany({
        where: {role: Role.PROF}
    });
    return res;
}

export const deleteProfessor = async(professorId) =>{
    const deleteProfessor = await prisma.user.delete({
        where:{
            id: professorId
        },
    });

    return deleteProfessor;
}

export const modifyProfessor = async(id, name, lastName, username, password) =>{
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, "sha512")
        .toString("hex");

    const updateProfessor = await prisma.user.update({
        where:{
            id: id,
        },
        data:{
            name: name,
            lastName: lastName,
            username: username,
            hash: hash,
            salt: salt
        }
    });

    return updateProfessor;
}

export async function findOneProfessor(profId){
    const res = await prisma.user.findUnique({
        where: {
            id: profId,
        }
    });

    return res;
}

export async function createAdministrator({username, name, lastName, password}){
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");

    const user = {
        id: uuidv4(),
        createdAt: Date.now().toString(),
        username,
        name,
        lastName,
        hash,
        salt,
        role: Role.ADMIN,
    };

    await prisma.user.create({ data: user });
    return { username, createdAt: Date.now() };
}

//find number of courses of a prof
export async function getProfCourseNumber(userId) {
    const res = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        include: {
            _count: {
                select: { courses: true }
            }
        }
    });

    return res;
}

export async function getProfCourse(userId){
    const res = prisma.course.findMany({
        where: {
            userId: userId,
        },
        
    });

    return res;
}

export async function getAllAdministrator() {
    const res = await prisma.user.findMany({
        where: {role: Role.ADMIN}
    });
    return res;
}

export const deleteAdmin = async(adminId) =>{
    console.log("AdminId: " + adminId);
    const deleteAdmin = await prisma.user.delete({
        where:{
            id: adminId,
        },
    });

    return deleteAdmin;
}

export const modifyAdmin = async(id, name, lastName, username, password) =>{
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, "sha512")
        .toString("hex");

    const updateAdmin = await prisma.user.update({
        where:{
            id: id,
        },
        data:{
            name: name,
            lastName: lastName,
            username: username,
            hash: hash,
            salt: salt
        }
    });

    return updateAdmin;
}

export async function findOneAdmin(adminId){
    console.log("adminId: " + adminId);
    const res = await prisma.user.findUnique({
        where: {
            id: adminId,
        }
    });

    return res;
}

