import mongoose from "mongoose";

// ── Comment sub-schema ───────────────────────────────────────────────────────
const commentSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text:      { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// ── History sub-schema ───────────────────────────────────────────────────────
const historySchema = new mongoose.Schema({
  action:    { type: String },
  field:     { type: String },
  oldValue:  { type: String },
  newValue:  { type: String },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  changedAt: { type: Date, default: Date.now },
});

// ── Task schema ──────────────────────────────────────────────────────────────
const taskSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    description: { type: String, default: "" },

    status: {
      type:    String,
      enum:    ["todo", "inprogress", "done"],
      default: "todo",
    },

    priority: {
      type:    String,
      enum:    ["low", "medium", "high"],
      default: "medium",
    },

    dueDate:    { type: Date,   default: null },
    image:      { type: String, default: null },

    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    user:       { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    comments: [commentSchema],
    history:  [historySchema],
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;