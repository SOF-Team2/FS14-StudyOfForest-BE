import express from "express";
import focusRoute from "./focusRoute.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Study Route" });
})

router.use("/", focusRoute);

export default router;