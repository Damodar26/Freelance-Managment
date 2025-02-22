import express from "express";
import { startTimeTracking, stopTimeTracking, getProductivityInsights } from "../controllers/timelogController.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"; // If authentication is required

const router = express.Router();

router.post("/start", verifyJWT, startTimeTracking);
router.post("/stop", verifyJWT, stopTimeTracking);
router.get("/insights", verifyJWT, getProductivityInsights);

export default router;
