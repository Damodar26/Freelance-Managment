import { Budget } from "../models/Budget.js";
import { Expense } from "../models/Expense.js"; // Make sure you have an Expense model
import { asyncHandler } from "../utils/asyncHandlers.js";
import { ApiError } from "../utils/ApiError.js";

// 1️⃣ Set Monthly Budget
export const setBudget = asyncHandler(async (req, res) => {
  const { monthlyBudget, category } = req.body;
  const userId = req.user._id;

  if (!monthlyBudget) {
    throw new ApiError(400, "Monthly budget is required");
  }

  let budget = await Budget.findOne({ user: userId });

  if (budget) {
    budget.monthlyBudget = monthlyBudget;
  } else {
    budget = new Budget({ user: userId, monthlyBudget });
  }

  await budget.save();

  res.status(200).json({ message: "Budget set successfully", budget });
});

// 2️⃣ Get Budget vs Expense Status
export const getBudgetStatus = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Fetch user's budget
  const budget = await Budget.findOne({ user: userId });

  if (!budget) {
    throw new ApiError(404, "No budget set for this user");
  }

  // Calculate total expenses for the current month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date();
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);
  endOfMonth.setDate(0);
  endOfMonth.setHours(23, 59, 59, 999);
  console.log("Querying expenses from:", startOfMonth, "to", endOfMonth);

  const totalExpenses = await Expense.aggregate([
    {
      $match: {
        user: userId,
        date: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  const expensesThisMonth = totalExpenses.length > 0 ? totalExpenses[0].total : 0;

  res.status(200).json({
    monthlyBudget: budget.monthlyBudget,
    totalExpenses: expensesThisMonth,
    remainingBudget: budget.monthlyBudget - expensesThisMonth,
    budgetExceeded: expensesThisMonth > budget.monthlyBudget ? true : false,
  });
});

// Update or Increase Budget
export const updateBudget = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { newBudget } = req.body;

  if (!newBudget || newBudget <= 0) {
    throw new ApiError(400, "New budget must be greater than zero.");
  }

  // Find existing budget
  let budget = await Budget.findOne({ user: userId });

  // If no budget exists, create a new one
  if (!budget) {
    budget = new Budget({ user: userId, monthlyBudget: newBudget });
    await budget.save();
    return res.status(201).json({
      message: "Budget set successfully.",
      monthlyBudget: budget.monthlyBudget,
      budgetExceeded: false,
    });
  }

  // Calculate total expenses for the current month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date();
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);
  endOfMonth.setDate(0);
  endOfMonth.setHours(23, 59, 59, 999);

  const totalExpenses = await Expense.aggregate([
    {
      $match: {
        user: userId,
        date: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  const expensesThisMonth = totalExpenses.length > 0 ? totalExpenses[0].total : 0;

  // If new budget is still lower than expenses, warn the user
  if (newBudget < expensesThisMonth) {
    return res.status(400).json({
      message: `Warning: Your total expenses (${expensesThisMonth}) exceed the new budget (${newBudget}). Increase further if needed.`,
      monthlyBudget: newBudget,
      totalExpenses: expensesThisMonth,
      budgetExceeded: true,
    });
  }

  // Update the budget
  budget.monthlyBudget = newBudget;
  await budget.save();

  res.status(200).json({
    message: "Budget updated successfully.",
    monthlyBudget: budget.monthlyBudget,
    totalExpenses: expensesThisMonth,
    remainingBudget: newBudget - expensesThisMonth,
    budgetExceeded: expensesThisMonth > newBudget ? true : false,
  });
});



// Get User Budgets
export const getUserBudgets = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const budgets = await Budget.find({ user: userId });
  res.json(budgets);
});
