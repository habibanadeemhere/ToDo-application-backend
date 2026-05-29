import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import authRoutes from "../routes/authRoutes.js";
import taskRoutes from "../routes/taskRoutes.js";
import path from "path";
import adminRoutes from "../routes/adminRoutes.js";


dotenv.config();

connectDB();

const app = express();
app.use("/uploads", express.static("uploads"));
app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 5000;

export default app
