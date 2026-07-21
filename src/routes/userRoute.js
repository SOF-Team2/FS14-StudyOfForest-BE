import express from "express";
import * as userController from "../controllers/userController.js";
import { verifyCurrentUser } from "../middlewares/currentUserMiddleware.js";

const router = express.Router();

// 회원가입
router.post("/signup", userController.signup);

// 로그인
router.post("/login", userController.login);

// 현재 로그인 사용자 정보 조회
router.get("/me", verifyCurrentUser, userController.getMe);

export default router;
