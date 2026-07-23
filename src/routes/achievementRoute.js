import express from "express";
import * as achievementController from "../controllers/achievementController.js";

const router = express.Router();

router.get("/", achievementController.getAchievements);

export default router;