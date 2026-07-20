import express from 'express';
import * as focusController from '../controllers/focusController.js';

const router = express.Router({ mergeParams: true });

router.post('/', focusController.getFocusData);
router.post('/session', focusController.createFocusSessionController);

export default router;