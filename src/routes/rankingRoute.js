import express from "express";
import * as rankingController from "../controllers/rankingController.js";

const router = express.Router();

router.get("/study", rankingController.getStudyRankings);
router.get("/user", rankingController.getUserRankings);
router.get("/previous-week", rankingController.getPreviousRankings);

export default router;
