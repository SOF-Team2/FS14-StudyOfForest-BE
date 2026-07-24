import express from "express";
import * as studyController from "../controllers/studyController.js";
import habitRoutes from './habitRoutes.js';
import focusRoute from "./focusRoute.js";
import studyMemberRoutes from "./studyMemberRoutes.js"
import {
  requireStudyHost,
  verifyCurrentUser,
  requireStudyMember,
} from "../middlewares/currentUserMiddleware.js";

const router = express.Router();


// 스터디 목록 조회와 생성 요청을 처리한다.
router.get("/", studyController.getStudies);
router.post("/", verifyCurrentUser, studyController.createStudy);

// 스터디 하위 집중 기능 라우터를 연결한다.
router.use("/:studyId/focus", verifyCurrentUser, requireStudyMember, focusRoute);
router.use("/:studyId/habit", verifyCurrentUser, requireStudyMember, habitRoutes);
router.use("/:studyId/members", studyMemberRoutes);

// 특정 스터디의 상세 조회, 수정, 삭제 요청을 처리한다.
router.get("/:studyId", studyController.getStudy);
router.patch(
  "/:studyId",
  verifyCurrentUser,
  requireStudyHost,
  studyController.updateStudy,
);
router.delete(
  "/:studyId",
  verifyCurrentUser,
  requireStudyHost,
  studyController.deleteStudy,
);

// 특정 스터디의 응원 이모지 추가 요청을 처리한다.
router.post("/:studyId/emojis", studyController.addEmoji);

//스터디 모집마감&재개 처리
router.patch("/:studyId/recruiting", studyController.updateRecruiting);
export default router;
