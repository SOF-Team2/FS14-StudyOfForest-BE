import express from "express";
import * as habitController from '../controllers/habitController.js';
const router = express.Router();

router.get("/studies/:studyId/habits", habitController.getHabits);
router.post("/studies/:studyId/habits", habitController.createHabit)
router.patch("/habits/:habitId", habitController.patchHabit)
router.delete("/habits/:habitId", habitController.deleteHabit)

export default router;