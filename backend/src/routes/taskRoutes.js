import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    createTask, 
    getTasksByProject, 
    updateTaskStatus, 
    deleteTask, 
    getTaskTimeLogs, 
    getTaskProductivityReport,
    getTaskAnalytics
} from "../controllers/task.Controller.js";

const router = express.Router();

router.post("/", verifyJWT, createTask);
router.get("/:projectId", verifyJWT, getTasksByProject);
router.patch("/:taskId/status", verifyJWT, updateTaskStatus);
router.delete("/:taskId", verifyJWT, deleteTask);

// Time tracking & productivity insights routes
router.post("/:taskId/log-hours", verifyJWT, getTaskTimeLogs);  // Log work hours for a task
router.get("/:taskId/productivity-insights", verifyJWT, getTaskProductivityReport);  // Fetch productivity data

router.get("/analytics", verifyJWT, getTaskAnalytics);




export default router;

