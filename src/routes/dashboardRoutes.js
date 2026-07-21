import express from "express";
import { getMyDashboard } from "../controllers/dashboardController.js";

const router = express.Router();
router.get("/dashboard", getMyDashboard);

export default router;