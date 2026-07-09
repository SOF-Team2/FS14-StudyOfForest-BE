import express from "express";
import * as habitController from '../controllers/habitController.js';
const router = express.Router();

router.get("/", habitController.getHabits);

export default router;