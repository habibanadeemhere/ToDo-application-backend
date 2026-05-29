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