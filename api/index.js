import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "../config/db.js";

import authRoutes  from "../routes/authRoutes.js";
import taskRoutes  from "../routes/taskRoutes.js";
import adminRoutes from "../routes/adminRoutes.js";

dotenv.config();
connectDB();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: "*",        // tighten this to your Vercel frontend URL in production
  credentials: true,
}));

// ── Body parsers ──────────────────────────────────────────────────────────────
// IMPORTANT: do NOT add express.json() before multer routes
// multer handles multipart; express.json() handles application/json
// Both can coexist because multer only fires when Content-Type is multipart
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Serve uploaded files statically ──────────────────────────────────────────
// e.g. https://your-backend.vercel.app/uploads/1234567890.jpg
app.use("/uploads", express.static("uploads"));

// ── Routes ───────────────────────────────────────────────────────────────────
app.use("/auth",  authRoutes);
app.use("/tasks", taskRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => res.send("API Running..."));

export default app;