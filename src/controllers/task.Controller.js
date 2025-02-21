import { Task } from "../models/task.model.js";
import { Project } from "../models/project.model.js";
import { User } from "../models/user.model.js";


// ✅ Create a new task under a project
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo, projectId } = req.body;

    if (!title || !priority || !projectId || !assignedTo) {
      return res.status(400).json({ message: "Title, priority, projectId and assignedTo are required." });
    }

    // ✅ Validate project existence
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // ✅ Ensure assigned user exists (optional)
    if (assignedTo) {
      // Check if user exists
      const userExists = await User.findById(assignedTo);
      if (!userExists) {
        return res.status(400).json({ message: "Assigned user not found" });
      }
    
      // Check if the user is a member of the project
      const isMember = project.members.includes(assignedTo);
      if (!isMember) {
        return res.status(403).json({ message: "User is not a member of this project" });
      }
    }
    
    // ✅ Create and save the task
    const newTask = new Task({
      title,
      description,
      priority,
      dueDate,
      assignedTo,
      project: projectId
    });

    await newTask.save();

    // ✅ Add task reference to the project
    await Project.findByIdAndUpdate(projectId, { $push: { tasks: newTask._id } });

    res.status(201).json({ message: "Task created successfully", task: newTask });
  } catch (error) {
    res.status(500).json({ message: "Failed to create task", error: error.message });
  }
};

// ✅ Get tasks for a specific project
export const getTasksByProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    // ✅ Validate project existence
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const tasks = await Task.find({ project: projectId }).populate("assignedTo", "username email");
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve tasks", error: error.message });
  }
};

// ✅ Update task status (Fixing incorrect status values)
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["To Do", "In Progress", "Done"]; // ✅ Corrected status values

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value. Allowed values: To Do, In Progress, Done." });
    }

    const task = await Task.findByIdAndUpdate(req.params.taskId, { status }, { new: true });

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Failed to update task", error: error.message });
  }
};

// ✅ Delete a task (Ensuring project exists before updating)
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // ✅ Remove task from project if the project exists
    if (task.project) {
      await Project.findByIdAndUpdate(task.project, { $pull: { tasks: task._id } });
    }

    await Task.findByIdAndDelete(req.params.taskId);

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete task", error: error.message });
  }
};

const Task = require("../models/task.model.js");
const ActivityLog = require("../models/activityLog.model");

// Get Time Logs for a Task
exports.getTaskTimeLogs = async (req, res) => {
    try {
        const { taskId } = req.params;
        const logs = await ActivityLog.find({ task: taskId, action: "Logged Time" }).populate("user", "name");

        res.status(200).json({ logs });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get Task-Level Productivity Insights
exports.getTaskProductivityReport = async (req, res) => {
    try {
        const { taskId } = req.params;
        const logs = await ActivityLog.find({ task: taskId, action: "Logged Time" });

        let totalHours = 0;
        let billableHours = 0;

        logs.forEach(log => {
            const match = log.description.match(/(\d+(\.\d+)?) hours/);
            if (match) {
                const hours = parseFloat(match[1]);
                totalHours += hours;
                if (log.description.includes("Billable")) billableHours += hours;
            }
        });

        res.status(200).json({ totalHours, billableHours });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
