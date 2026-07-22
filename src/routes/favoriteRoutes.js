import { Router } from "express";
import * as favoriteController from "../controllers/favoriteController.js";

const router = Router();

router.post("/:studyId", favoriteController.toggleFavorite);
router.get("/me", favoriteController.getMyFavoriteStudies);

export default router;