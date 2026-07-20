import express from "express";
import * as userController from "../controllers/userController.js";

const router = express.Router();

// 회원가입
router.post("/signup", userController.signup);

export default router;