import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  addComment,
  deleteComment,
} from "../controllers/taskController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// upload.single("image") is on EVERY mutating route
// — multer is smart: if no file is sent it just sets req.file = undefined
// — this means FormData with or without image is always parsed correctly
router.post("/", authMiddleware, upload.single("image"), createTask);
router.get("/", authMiddleware, getTasks);
router.put("/:id", authMiddleware, upload.single("image"), updateTask);
router.delete("/:id", authMiddleware, deleteTask);

// Comments
router.post("/:id/comments",             authMiddleware, addComment);
router.delete("/:id/comments/:commentId", authMiddleware, deleteComment);



export default router;