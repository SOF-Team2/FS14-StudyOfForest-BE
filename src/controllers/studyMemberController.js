import * as studyMemberService from "../services/studyMemberService.js"


export const getMembers = async (req, res) => {
    const studyId = req.params.studyId;
    const members = await studyMemberService.getMembers(studyId);
    res.json(members);
}

export const join = async (req, res) => {
    const userId = req.currentUser.id;
    const studyId = req.params.studyId;
    const member = await studyMemberService.join(userId,studyId)
    res.json(member);
}

export const removeStudy = async (req, res) => {
    const userId = req.currentUser.id;
    const studyId = req.params.studyId;
    const member = await studyMemberService.removeStudy(userId,studyId)
    res.json(member);
}

export const countMembers= async (req, res) => {
    const studyId = req.params.studyId;
    const count = await studyMemberService.countMembers(studyId)
    res.json(count);
}

export const getMember = async (req, res) => {
    const userId = req.currentUser.id;
    const studyId = req.params.studyId;
    const member = await studyMemberService.getMember(userId,studyId)
    res.json(member);
} 

