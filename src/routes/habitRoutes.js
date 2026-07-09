import express from "express";
import * as habitController from '../controllers/habitController.js';
const router = express.Router({ mergeParams: true });

router.get("/", habitController.getHabits);
router.post("/", habitController.createHabit)
router.patch("/:habitId", habitController.patchHabit)
router.delete("/:habitId", habitController.deleteHabit)

export default router;