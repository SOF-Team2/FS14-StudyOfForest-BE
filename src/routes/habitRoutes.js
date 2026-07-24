import express from "express";
import * as habitController from "../controllers/habitController.js";
import { requireStudyHost } from "../middlewares/currentUserMiddleware.js";

const router = express.Router({ mergeParams: true });

// HOST와 MEMBER 모두 가능
// 스터디의 습관 목록 + 현재 유저의 오늘 기록 조회
router.get("/", habitController.getHabits);
// 현재 유저의 주간 습관 기록 조회
router.get("/weekly", habitController.getWeeklyHabitRecords);
// 현재 유저의 자신의 습관 기록 체크
router.patch("/:habitId/record", habitController.toggleHabitRecord);

// HOST만 가능
// 스터디 공용 습관 생성
router.post("/", requireStudyHost, habitController.createHabit);
// 스터디 공용 습관 수정 및 추가
router.patch("/", requireStudyHost, habitController.updateHabit);
// 스터디 공용 습관 삭제
router.delete("/:habitId", requireStudyHost, habitController.deleteHabit);

export default router;