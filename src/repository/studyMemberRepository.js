import prisma from "../lib/prisma.js"

export const findByStudyId = async(studyId) => {
    const members = await prisma.studyMember.findMany({
        where: {studyId : studyId},
    })
    return members
}

export const create = async(userId, studyId) => {
    const member = await prisma.studyMember.create({
        data: {
            userId: userId,
            studyId: studyId,
            role: "MEMBER",
        }
    })
    return member;
}

