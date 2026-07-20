import * as studyMemberRepository from "../repository/studyMemberRepository.js"


export const getMembers = async (studyId) => {
    const members = await studyMemberRepository.findByStudyId(studyId);
    return members;
}

export const join = async (userId,studyId) => {
    const member = await studyMemberRepository.create(userId,studyId);
    return member;
}

export const removeStudy = async (userId,studyId) => {
    const member = await studyMemberRepository.deleteMember(userId,studyId);
    return member;
}