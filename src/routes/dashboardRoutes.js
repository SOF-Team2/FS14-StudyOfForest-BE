import express from "express";
import { getMyDashboard } from "../controllers/dashboardController.js";

const router = express.Router();
router.get("/me/dashboard", getMyDashboard);

export default router;