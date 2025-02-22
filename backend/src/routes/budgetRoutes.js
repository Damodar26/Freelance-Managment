import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { setBudget, getUserBudgets, getBudgetStatus, updateBudget } from "../controllers/budgetController.js";

const router = express.Router();

router.post("/", verifyJWT, setBudget);
router.get("/", verifyJWT, getUserBudgets);
router.get("/status", verifyJWT, getBudgetStatus);
router.patch("/update", verifyJWT, updateBudget);

export default router;
