import express from "express";
import cors from "cors";
import "dotenv/config"
import studyRoutes from "./src/routes/studyRoutes.js";
import habitRoutes from "./src/routes/habitRoutes.js";
import userRoute from "./src/routes/userRoute.js";


const app = express();

app.use(express.json());
app.use(cors());
app.use("/study", studyRoutes);
app.use("/", habitRoutes);
app.use("/users", userRoute);

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.listen(3000, () => {
  console.log("Server Start");
});