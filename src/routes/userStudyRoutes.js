import express from "express";
import { getMyStudies } from "../controllers/userStudyController.js";

const router = express.Router();

router.get("/me/studies", getMyStudies);

export default router;
