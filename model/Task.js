// models/Task.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  employeeName: {
    type: String,
  },
  task: {
    type: String,
  },
  explainAboutTask: {
    type: String,
  },
  date: {
    type: Date,
  },
  pendingWork: {
    type: String,
  },
  completedWork: {
    type: String,
  },
  workStatus: {
    type: String,
    enum: ["Completed", "Pending", "Not Started"], // Only these values are allowed
  },
});

// Create the Task model based on the schema
const Task = mongoose.model("tasks", TaskSchema);

module.exports = Task;
