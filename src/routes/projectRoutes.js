import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import { createProject, getProjects, getProjectById, addMemberToProject, deleteProject } from "../controllers/projectController.js";

const router = express.Router();

router.post("/add", verifyJWT, createProject);
router.get("/", verifyJWT, getProjects);
router.get("/:projectId", verifyJWT, getProjectById);
router.patch("/:projectId/add-member", verifyJWT, addMemberToProject);
router.delete("/:projectId", verifyJWT, deleteProject);

export default router;
