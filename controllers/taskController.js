import Task from "../models/Task.js";

// CREATE TASK
export const createTask = async (req, res) => {

  try {

    const { title, description, status } = req.body;

    // ✅ FIX: full URL so frontend <img src> can load it
    const image = req.file
      ? `${req.protocol}://${req.get("host")}/${req.file.path.replace(/\\/g, "/")}`
      : null;

    const task = await Task.create({
      title,
      description,
      status,
      image,              // ✅ save image to DB
      user: req.user.id,
    });

    res.status(201).json(task);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message,
    });

  }

};

// GET TASKS
export const getTasks = async (req, res) => {

  try {

    // ✅ populate user so frontend can show name + avatar on each card
    const tasks = await Task.find().populate("user", "name email avatar");

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

    // ✅ FIX: if a new image was uploaded, include it in the update
    if (req.file) {
      updateData.image = `${req.protocol}://${req.get("host")}/${req.file.path.replace(/\\/g, "/")}`;
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updatedTask);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

// DELETE TASK
export const deleteTask = async (req, res) => {

  try {

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      message: "Task deleted",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

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