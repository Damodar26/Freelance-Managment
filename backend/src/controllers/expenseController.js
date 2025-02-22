import { Expense } from "../models/Expense.js";
import { asyncHandler } from "../utils/asyncHandlers.js";
import { ApiError } from "../utils/ApiError.js";
import { Budget } from "../models/Budget.js";
import nodemailer from "nodemailer";

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // Use Gmail or your preferred service
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

// Function to send email notification
const sendBudgetExceededEmail = async (userEmail, remainingBudget) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "🚨 Budget Exceeded Alert!",
    text: `You have exceeded your budget limit! Your remaining budget is ${remainingBudget}. Please update your budget to continue adding expenses.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("📩 Budget exceeded email sent!");
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

// Add Expense Function with Budget Check
export const addExpense = asyncHandler(async (req, res) => {
  const { amount, category, date } = req.body;
  const userId = req.user._id;

  if (!amount || !category) {
    throw new ApiError(400, "Amount and category are required");
  }

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
  const updatedTotalExpenses = expensesThisMonth + amount;

  // 🚫 Prevent adding expense if budget is exceeded
  if (expensesThisMonth + amount > budget.monthlyBudget) {
  // 📩 Send email if budget is exceeded
    if (updatedTotalExpenses > budget.monthlyBudget) {
      const userEmail = req.user.email; // Ensure user email is available
      console.log(userEmail);
      await sendBudgetExceededEmail(userEmail, budget.monthlyBudget - updatedTotalExpenses);
    }
    throw new ApiError(400, "Budget exceeded! Increase your budget to add more expenses.");
  }

  // Save new expense
  const expense = new Expense({
    user: userId,
    amount,
    category,
    date: date ? new Date(date) : new Date(),
  });

  await expense.save();

  // 🔄 Recalculate total expenses after adding the new expense
  

  res.status(201).json({
    message: "Expense added successfully",
    expense,
    monthlyBudget: budget.monthlyBudget,
    totalExpenses: updatedTotalExpenses,
    remainingBudget: budget.monthlyBudget - updatedTotalExpenses,
    budgetExceeded: updatedTotalExpenses > budget.monthlyBudget,
  });
});


// Get User Expenses
export const getUserExpenses = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const expenses = await Expense.find({ user: userId }).sort({ date: -1 });
  res.json(expenses);
});

// Delete Expense
export const deleteExpense = asyncHandler(async (req, res) => {
  await Expense.findByIdAndDelete(req.params.expenseId);
  res.json({ message: "Expense deleted" });
});
