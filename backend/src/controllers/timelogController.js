import { TimeLog } from "../models/timeLog.model.js";
import { Project } from "../models/project.model.js";
import { Task } from "../models/task.model.js";

export const startTimeTracking = async (req, res) => {
  try {
    const { projectId, taskId, billable, hourlyRate } = req.body;
    const userId = req.user._id;

    // Validate project and task existence
    const project = await Project.findById(projectId);
    const task = await Task.findById(taskId);
    if (!project || !task) return res.status(404).json({ message: "Project or Task not found" });

    const newTimeLog = new TimeLog({
      user: userId,
      project: projectId,
      task: taskId,
      startTime: new Date(),
      billable,
      hourlyRate: billable ? hourlyRate : 0,
    });

    await newTimeLog.save();
    res.status(201).json({ message: "Time tracking started", timeLog: newTimeLog });
  } catch (error) {
    res.status(500).json({ message: "Error starting time tracking", error: error.message });
  }
};

export const stopTimeTracking = async (req, res) => {
    try {
      const { timeLogId } = req.body;
      const userId = req.user._id;
  
      const timeLog = await TimeLog.findOne({ _id: timeLogId, user: userId });
      if (!timeLog) return res.status(404).json({ message: "Time log not found" });
  
      if (timeLog.endTime) return res.status(400).json({ message: "Time tracking already stopped" });
  
      timeLog.endTime = new Date();
      timeLog.duration = Math.round((timeLog.endTime - timeLog.startTime) / (1000 * 60)); // Convert ms to minutes
  
      if (timeLog.billable && timeLog.hourlyRate) {
        timeLog.earnings = (timeLog.duration / 60) * timeLog.hourlyRate; // Earnings calculation
      }
  
      await timeLog.save();
      res.status(200).json({ message: "Time tracking stopped", timeLog });
    } catch (error) {
      res.status(500).json({ message: "Error stopping time tracking", error: error.message });
    }
  };

  export const getProductivityInsights = async (req, res) => {
    try {
      const userId = req.user._id;
      
      const timeLogs = await TimeLog.aggregate([
        { $match: { user: userId } },
        { 
          $group: { 
            _id: "$project",
            totalHours: { $sum: { $divide: ["$duration", 60] } }, // Convert minutes to hours
            billableHours: { $sum: { $cond: ["$billable", { $divide: ["$duration", 60] }, 0] } },
            totalEarnings: { $sum: "$earnings" }
          }
        },
        { 
          $lookup: { 
            from: "projects", 
            localField: "_id", 
            foreignField: "_id", 
            as: "projectDetails" 
          } 
        }
      ]);
  
      res.status(200).json({ insights: timeLogs });
    } catch (error) {
      res.status(500).json({ message: "Error fetching insights", error: error.message });
    }
  };
  