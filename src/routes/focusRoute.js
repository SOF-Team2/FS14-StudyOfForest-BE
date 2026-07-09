import express from "express";
import * as focusController from '../controllers/focusController.js';
const router = express.Router();

router.patch('/studies/:id/focus/point', focusController.updateFocusPointController);

export default router;