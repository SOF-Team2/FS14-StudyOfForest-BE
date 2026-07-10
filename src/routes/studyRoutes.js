import express from "express";
import * as studyController from "../controllers/studyController.js";
import focusRoute from './focusRoute.js';

const router = express.Router();

router.get("/", studyController.getStudies);
router.post("/", studyController.createStudy);
router.get("/:studyId", studyController.getStudy);
router.patch("/:studyId", studyController.updateStudy);
router.delete("/:studyId", studyController.deleteStudy);
router.post("/:studyId/emojis", studyController.addEmoji);

router.use('/', focusRoute);

export default router;
