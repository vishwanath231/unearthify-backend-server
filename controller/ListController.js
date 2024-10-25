const Task = require("../model/Task");

// Handle POST request to add a task
const todoList = async (req, res) => {
  try {
    const {
      employeeName,
      task,
      explainAboutTask,
      date,
      pendingWork,
      completedWork,
      workStatus,
    } = req.body;
    // Create a new task instance
    const newTask = new Task({
      employeeName,
      task,
      explainAboutTask,
      date,
      pendingWork,
      completedWork,
      workStatus,
    });

    // Save the task to the database
    const savedTask = await newTask.save();
    res
      .status(200)
      .json({ message: "Task saved successfully", Data: savedTask });
  } catch (error) {
    res.status(500).json({ error: "Error saving task" });
  }
};

// task get
const taskData = async (req, res) => {
  // console.log("asd");
  try {
    const taskDataGet = await Task.find();
    res.json({
      data: taskDataGet,
    });
  } catch (error) {
    res.json({
      Error: error.message,
    });
  }
};

// get data by serial num
const GetSingleData = async (req, res) => {
  try {
    const id = req.params.id; // Fetch _id from request params
    console.log(id, "id");

    const data = await Task.findById(id); // Use MongoDB _id to fetch the task
    console.log(data, "data");

    if (!data) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({
      data: data,
    });
    console.log(data, "data");
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// update data by serial num

const updateData = async (req, res) => {
  try {
    const { id } = req.params; // Fetch _id from request params
    const {
      task,
      explainAboutTask,
      date,
      pendingWork,
      completedWork,
      workStatus,
    } = req.body;

    // Use MongoDB _id to find and update the task
    const updatedData = await Task.findByIdAndUpdate(
      id,
      {
        $set: {
          task: task,
          explainAboutTask: explainAboutTask,
          date: date,
          pendingWork: pendingWork,
          completedWork: completedWork,
          workStatus: workStatus,
        },
      },
      { new: true } // Return the updated document
    );
    console.log(updatedData, "update");

    if (!updatedData) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ data: updatedData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteNote = async (req, res) => {
  try {
    const id = req.params.id; // Fetch _id from request params
    console.log(id, "id");

    // Check if the task exists before deletion
    const existingTask = await Task.findById(id);
    console.log(existingTask, "delete id");

    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const deleteGet = await Task.findByIdAndDelete(id); // Delete the task by _id
    console.log(deleteGet, "deleted id true");

    res.status(200).json({
      data: deleteGet,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  todoList,
  taskData,
  updateData,
  GetSingleData,
  deleteNote,
};
