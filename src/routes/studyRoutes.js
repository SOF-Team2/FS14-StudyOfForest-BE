import express from "express";
import * as studyController from "../controllers/studyController.js";
import habitRoutes from './habitRoutes.js';
import focusRoute from "./focusRoute.js";

const router = express.Router();


// 스터디 목록 조회와 생성 요청을 처리한다.
router.get("/", studyController.getStudies);
router.post("/", studyController.createStudy);

// 스터디 하위 집중 기능 라우터를 연결한다.
router.use("/:studyId/focus", focusRoute);
router.use("/:studyId/habit", habitRoutes);
// 특정 스터디의 상세 조회, 수정, 삭제 요청을 처리한다.
router.get("/:studyId", studyController.getStudy);
router.patch("/:studyId", studyController.updateStudy);
router.delete("/:studyId", studyController.deleteStudy);

// 특정 스터디의 응원 이모지 추가 요청을 처리한다.
router.post("/:studyId/emojis", studyController.addEmoji);

export default router;
