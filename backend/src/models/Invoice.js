import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ["Pending", "Paid", "Overdue"], default: "Pending" },
    razorpayOrderId: { type: String }, // Razorpay Order ID
    razorpayPaymentId: { type: String }, // Payment ID
    razorpaySignature: { type: String }, // Payment verification signature
  },
  { timestamps: true }
);

export const Invoice = mongoose.model("Invoice", InvoiceSchema);
