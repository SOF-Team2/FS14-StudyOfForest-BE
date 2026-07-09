import express from "express";
import habitRoutes from './habitRoutes.js';

const router = express.Router();
router.use("/:studyId/habit", habitRoutes);

router.get("/", (req, res) => {
    res.json({ message: "Study Route" });
})

export default router;