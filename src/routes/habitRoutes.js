import express from "express";
import * as habitController from '../controllers/habitController.js';
const router = express.Router();

router.get("/study/:studyId/habit", habitController.getHabits);
router.post("/study/:studyId/habit", habitController.createHabit)
router.patch("/habit/:habitId", habitController.patchHabit)
router.delete("/habit/:habitId", habitController.deleteHabit)

export default router;