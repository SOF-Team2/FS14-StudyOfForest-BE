import express from "express";
import cors from "cors";
import "dotenv/config"
import studyRoutes from "./routes/studyRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/study", studyRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.listen(3000, () => {
  console.log("Server Start");
});