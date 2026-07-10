import express from 'express';
import * as focusController from '../controllers/focusController.js';

const router = express.Router();

router.post('/:studyId/focus', focusController.getFocusData);
router.patch('/:studyId/focus/point', focusController.updateFocusPointController);

export default router;import express from "express";

const router = express.Router();

export default router;