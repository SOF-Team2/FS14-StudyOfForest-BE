import express from "express";
import * as goalController from "../controllers/goalController.js";

const router = express.Router();

router.get("/goal", goalController.getMyGoal);
router.patch("/goal", goalController.updateMyGoal);

export default router;