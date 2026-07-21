import express from "express";
import cors from "cors";
import "dotenv/config"
import studyRoutes from "./src/routes/studyRoutes.js";
import habitRoutes from "./src/routes/habitRoutes.js";
import rankingRoutes from "./src/routes/rankingRoute.js";
import userStudyRoutes from "./src/routes/userStudyRoutes.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/study", studyRoutes);
app.use("/", habitRoutes);
app.use("/ranking", rankingRoutes);
app.use("/api/studies", studyRoutes);
app.use("/api/users", userStudyRoutes);
app.use("/api/users", dashboardRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.listen(3000, () => {
  console.log("Server Start");
});