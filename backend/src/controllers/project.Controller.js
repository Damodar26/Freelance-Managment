import { Project } from "../models/project.model.js";
import { Task } from "../models/task.model.js";
import { asyncHandler } from "../utils/asyncHandlers.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ActivityLog } from "../models/activity.model.js";

// Create a new project
export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const owner = req.user._id;

    if (!name || !owner) {
      return res.status(400).json({ message: "Name and owner fields are required." });
    }

    const project = new Project({ name, description, owner, members: [owner] });

    await project.save();
    res.status(201).json({ message: "Project created successfully", project });
  } catch (error) {
    res.status(500).json({ message: "Failed to create project", error: error.message });
  }
};

// Get all projects for the logged-in user
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: "active", members: req.user._id })
      .populate("members", "username email")
      .populate("tasks");

    const formattedProjects = projects.map((project) => ({
      id: project._id.toString(),
      name: project.name,
      deadline: project.deadline?.toISOString() || "",
      tasks: project.tasks.length.toString(),
      progress: project.totalHoursWorked,
      team: project.members.map((member) => member.username),
      status: project.status,
    }));

    res.status(200).json(formattedProjects);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve projects", error: error.message });
  }
};

// Get a specific project
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).populate("members", "username email");
    
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (!project.members.includes(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized access to project" });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve project", error: error.message });
  }
};

// Delete a project and its tasks
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    await Task.deleteMany({ project: project._id });
    await Project.findByIdAndDelete(req.params.projectId);

    res.status(200).json({ message: "Project and related tasks deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete project", error: error.message });
  }
};

// Add a user to a project
export const addMemberToProject = async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.projectId);

    if (!project) return res.status(404).json({ message: "Project not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (project.members.includes(userId)) {
      return res.status(400).json({ message: "User is already a member" });
    }

    project.members.push(userId);
    await project.save();

    res.status(200).json({ message: "Member added successfully", project });
  } catch (error) {
    res.status(500).json({ message: "Failed to add member", error });
  }
};

// Get Time Logs for a Project
export const getProjectTimeLogs = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project.members.includes(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized to view logs" });
    }

    const logs = await ActivityLog.find({ project: projectId, action: "Logged Time" }).populate("user", "name");

    res.status(200).json({ logs });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Generate Project Productivity Report
export const getProjectProductivityReport = async (req, res) => {
  try {
    const { projectId } = req.params;
    const logs = await ActivityLog.find({ project: projectId, action: "Logged Time" });

    let totalHours = 0;
    let billableHours = 0;
    let userHours = {};

    logs.forEach(log => {
      const match = log.description.match(/(\d+(\.\d+)?) hours/);
      if (match) {
        const hours = parseFloat(match[1]);
        totalHours += hours;
        if (log.description.includes("Billable")) billableHours += hours;
        userHours[log.user] = (userHours[log.user] || 0) + hours;
      }
    });

    res.status(200).json({ totalHours, billableHours, userHours });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Project Analytics
export const getProjectAnalytics = async (req, res) => {
  try {
    const projects = await Project.find();
    const analytics = await Promise.all(
      projects.map(async (project) => {
        const totalTasks = await Task.countDocuments({ project: project._id });
        return {
          _id: project._id,
          name: project.name,
          totalHoursWorked: project.totalHoursWorked,
          totalTasks,
        };
      })
    );

    res.status(200).json({ projects: analytics });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch project analytics", error });
  }
};
