import express from "express";
import * as rankingController from "../controllers/rankingController.js";

const router = express.Router();

router.get("/study", rankingController.getStudyRankings);
router.get("/user", rankingController.getUserRankings);

export default router;
