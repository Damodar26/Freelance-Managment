import mongoose from "mongoose";

const BudgetSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: false },
    monthlyBudget: { type: Number, required: true },// Budget limit for the category
  },
  { timestamps: true }
);

export const Budget = mongoose.model("Budget", BudgetSchema);
