import express from "express";
import * as studyMemberController from "../controllers/studyMemberController.js";

const router = express.Router({ mergeParams: true });
router.get("/", studyMemberController.getMembers);
router.post("/", studyMemberController.join);
router.delete("/", studyMemberController.removeStudy);


export default router;