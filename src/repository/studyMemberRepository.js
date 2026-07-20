import prisma from "../lib/prisma.js"

//스터디 참여자 조회
export const findByStudyId = async(studyId) => {
    const members = await prisma.studyMember.findMany({
        where: {studyId : studyId},
    })
    return members
}

//스터디 들어가기
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

//스터디 나가기
export const deleteMember = async (userId, studyId) => {
    const member = await prisma.studyMember.delete({
        where: {
            userId_studyId: {
            userId: userId,
            studyId: studyId,
        }
    },
    })
    return member;
}