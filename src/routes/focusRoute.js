import express from 'express';
import * as focusController from '../controllers/focusController.js';

const router = express.Router({ mergeParams: true });

router.post('/', focusController.getFocusData);
router.patch('/point', focusController.updateFocusPointController);

export default router;