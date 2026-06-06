import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "../config/db.js";

import authRoutes from "../routes/authRoutes.js";
import taskRoutes from "../routes/taskRoutes.js";
import adminRoutes from "../routes/adminRoutes.js";

dotenv.config();

// ✅ CREATE APP (THIS WAS MISSING)
const app = express();

// DB connection
let isConnected = false;

const connect = async () => {
  if (isConnected) return;
  await connectDB();
  isConnected = true;
};

connect();

// ── CORS ─────────────────────────────
app.use(cors({
  origin: "https://to-do-application-frontend-phi.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// IMPORTANT: handle preflight properly


// ── Body parsers ────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static uploads ───────────────────
app.use("/uploads", express.static("uploads"));


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://to-do-application-frontend-phi.vercel.app");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  next();
});


// ── Routes ───────────────────────────
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => res.send("API Running..."));

export default app;