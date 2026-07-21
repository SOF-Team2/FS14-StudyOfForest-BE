import express from "express";
import * as studyMemberController from "../controllers/studyMemberController.js";
import { verifyCurrentUser } from "../middlewares/currentUserMiddleware.js";

const router = express.Router({ mergeParams: true });

router.get("/", studyMemberController.getMembers);

router.post(
  "/",
  verifyCurrentUser,
  studyMemberController.join,
);

router.delete(
  "/",
  verifyCurrentUser,
  studyMemberController.removeStudy,
);

router.get("/count", studyMemberController.countMembers);

router.get(
  "/check",
  verifyCurrentUser,
  studyMemberController.getMember,
);

export default router;