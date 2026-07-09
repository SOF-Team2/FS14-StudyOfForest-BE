import express from "express";
import * as studyController from "../controllers/studyController.js";
import habitRoutes from './habitRoutes.js';
import habitRoutes from './habitRoutes.js';

const router = express.Router();
router.use("/:studyId/habit", habitRoutes);

router.get("/", studyController.getStudies);
router.post("/", studyController.createStudy);
router.get("/:studyId", studyController.getStudy);
router.patch("/:studyId", studyController.updateStudy);
router.delete("/:studyId", studyController.deleteStudy);
router.post("/:studyId/emojis", studyController.addEmoji);

export default router;
