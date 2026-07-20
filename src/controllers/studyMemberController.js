import * as studyMemberService from "../services/studyMemberService.js"


export const getMembers = async (req, res) => {
    const studyId = req.params.studyId;
    const members = await studyMemberService.getMembers(studyId);
    res.json(members);
}

export const join = async (req, res) => {
    const userId = req.body.userId;
    const studyId = req.params.studyId;
    const member = await studyMemberService.join(userId,studyId)
    res.json(member);
}