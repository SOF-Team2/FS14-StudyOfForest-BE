import express from 'express'
import * as focusController from '../controllers/focusController.js';

const router = express.Router({ mergeParams: true });

router.post('/:id/focus', focusController.getFocusData);
router.patch('/:id/focus/point', focusController.updateFocusPointController);

export default router