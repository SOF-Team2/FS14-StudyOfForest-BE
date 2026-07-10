import express from 'express'
import * as focusController from '../controllers/focusController.js';

const router = express.Router({ mergeParams: true });

router.post('/:studyId/focus', focusController.getFocusData);
router.patch('/:studyId/focus/point', focusController.updateFocusPointController);

export default router