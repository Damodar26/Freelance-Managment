import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addExpense, getUserExpenses, deleteExpense } from "../controllers/expenseController.js";

const router = express.Router();

router.post("/", verifyJWT, addExpense);
router.get("/", verifyJWT, getUserExpenses);
router.delete("/:expenseId", verifyJWT, deleteExpense);

export default router;
