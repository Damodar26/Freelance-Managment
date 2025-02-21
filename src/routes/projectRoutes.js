import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import { 
    createProject, 
    getProjects, 
    getProjectById, 
    addMemberToProject, 
    deleteProject, 
    logProjectWorkHours, 
    getProjectProductivityInsights 
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/add", verifyJWT, createProject);
router.get("/", verifyJWT, getProjects);
router.get("/:projectId", verifyJWT, getProjectById);
router.patch("/:projectId/add-member", verifyJWT, addMemberToProject);
router.delete("/:projectId", verifyJWT, deleteProject);

// Time tracking & productivity insights routes
router.post("/:projectId/log-hours", verifyJWT, logProjectWorkHours);  // Log work hours for a project
router.get("/:projectId/productivity-insights", verifyJWT, getProjectProductivityInsights);  // Fetch productivity data

export default router;

