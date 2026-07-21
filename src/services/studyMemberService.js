import * as studyMemberRepository from "../repository/studyMemberRepository.js"
import studyRepository from "../repository/studyRepository.js";


export const getMembers = async (studyId) => {
    const members = await studyMemberRepository.findByStudyId(studyId);
    return members;
}

export const join = async (userId,studyId) => {
    const count = await studyMemberRepository.countByStudyId(studyId);
    const study = await studyRepository.findById(studyId)
    const maxCount = study.maxMembers;
    if(count >= maxCount) {
        throw new Error("정원이 가득 찼습니다.")
    }
    
    const member = await studyMemberRepository.create(userId,studyId);
    return member;
}

export const removeStudy = async (userId,studyId) => {
    const member = await studyMemberRepository.deleteMember(userId,studyId);
    return member;
}

export const countMembers = async (studyId) => {
    const count = await studyMemberRepository.countByStudyId(studyId);
    return count;
}

export const getMember = async (userId, studyId) => {
    const member = await studyMemberRepository.findMember(userId, studyId);
    const isHost = member?.role ==="HOST";
    return isHost;
}

