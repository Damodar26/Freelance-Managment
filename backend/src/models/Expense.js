import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true }, // e.g., software, hardware, travel
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Expense = mongoose.model("Expense", ExpenseSchema);
