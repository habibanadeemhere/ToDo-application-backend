import Task from "../models/Task.js";
import cloudinary from "../config/cloudinary.js";

console.log("USER:", req.user);
console.log("BODY:", req.body);
// CREATE TASK
export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    let imageUrl = null;

  console.log("FILE:", req.file); // 🔥 DEBUG

    if (req.file) {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        {
          folder: "tasks",
        }
      );

      imageUrl = result.secure_url;
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
      image: imageUrl,
    user: req.user?.id || req.user?._id,
    });

    res.status(201).json(task);
  } catch (err) {
     console.log("CREATE TASK ERROR FULL:", err);
  console.log("STACK:", err.stack);
    res.status(500).json({ message: err.message });
  }
};

// GET TASKS
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("user", "name email avatar")
      .populate("assignedTo", "name email avatar")
      .populate("comments.user", "name email avatar");

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE TASK
export const updateTask = async (req, res) => {
  try {
    const updateData = { ...req.body };

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // delete old image if new one comes
    if (req.file) {
      if (task.image) {
        const publicId = task.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`tasks/${publicId}`);
      }

      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        { folder: "tasks" }
      );

      updateData.image = result.secure_url;
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//DELETE
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // delete image from cloudinary
    if (task.image) {
      const publicId = task.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`tasks/${publicId}`);
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD COMMENT
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ message: "Comment text required" });

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.comments.push({ user: req.user.id, text, createdAt: new Date() });
    await task.save();

    const populated = await Task.findById(task._id)
      .populate("comments.user", "name email avatar")
      .populate("user",          "name email avatar")
      .populate("assignedTo",    "name email avatar");

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE COMMENT
export const deleteComment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const comment = task.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const isOwner = String(comment.user) === String(req.user.id);
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) return res.status(403).json({ message: "Not authorized" });

    task.comments.pull({ _id: req.params.commentId });
    await task.save();

    const populated = await Task.findById(task._id)
      .populate("comments.user", "name email avatar")
      .populate("user",          "name email avatar")
      .populate("assignedTo",    "name email avatar");

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};