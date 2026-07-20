import express from 'express';
import * as focusController from '../controllers/focusController.js';

const router = express.Router({ mergeParams: true });

router.post('/', focusController.getFocusData);
router.post('/session', focusController.createFocusSessionController);
router.post('/sessions', focusController.getFocusSessionsController);   // 통계 조회

export default router;