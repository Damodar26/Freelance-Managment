import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTask, getTasksByProject, updateTaskStatus, deleteTask } from "../controllers/taskController.js";

const router = express.Router();

router.post("/", verifyJWT, createTask);
router.get("/:projectId", verifyJWT, getTasksByProject);
router.patch("/:taskId/status", verifyJWT, updateTaskStatus);
router.delete("/:taskId", verifyJWT, deleteTask);

export default router;
