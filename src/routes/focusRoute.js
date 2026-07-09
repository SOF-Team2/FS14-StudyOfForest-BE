import express from 'express'
import { get_focus_data } from '../controllers/focusController.js'

const router = express.Router()

router.post('/:id/focus', get_focus_data)

export default router