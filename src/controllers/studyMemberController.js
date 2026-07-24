import * as studyMemberService from "../services/studyMemberService.js"


export const getMembers = async (req, res) => {
  try {
    const studyId = req.params.studyId;
    const members = await studyMemberService.getMembers(studyId);
    res.json(members);
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
}

export const join = async (req, res) => {
  try {
    const userId = req.currentUser.id;
    const studyId = req.params.studyId;
    const member = await studyMemberService.join(userId, studyId);
    res.json(member);
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
};

export const removeStudy = async (req, res) => {
  try {
    const userId = req.currentUser.id;
    const studyId = req.params.studyId;
    const member = await studyMemberService.removeStudy(userId, studyId);
    res.json(member);
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
};

export const countMembers = async (req, res) => {
  try {
    const studyId = req.params.studyId;
    const count = await studyMemberService.countMembers(studyId)
    res.json(count);
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
}

export const getMember = async (req, res) => {
  try {
    const userId = req.currentUser.id;
    const studyId = req.params.studyId;
    const member = await studyMemberService.getMember(userId, studyId)
    res.json(member);
  } catch (error) {
    res.status(400).json({ error: { message: error.message } });
  }
}