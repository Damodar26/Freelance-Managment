import { razorpay } from "../config/razorpay.js";
import { Invoice } from "../models/invoice.js";
import { asyncHandler } from "../utils/asyncHandlers.js";
import { ApiError } from "../utils/ApiError.js";
import crypto from "crypto";

// Create a new invoice and generate a Razorpay order
export const createInvoice = asyncHandler(async (req, res) => {
  const { clientName, clientEmail, amount, dueDate } = req.body;
  const userId = req.user._id;

  if (!clientName || !clientEmail || !amount || !dueDate) {
    throw new ApiError(400, "All fields are required");
  }

  // Create a Razorpay order
  const options = {
    amount: amount * 100, // Razorpay expects amount in paise (multiply by 100)
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  const order = await razorpay.orders.create(options);

  // Create the invoice
  const invoice = new Invoice({
    clientName,
    clientEmail,
    amount,
    dueDate,
    user: userId,
    razorpayOrderId: order.id,
  });

  await invoice.save();

  res.status(201).json({
    message: "Invoice created successfully",
    invoice,
    orderId: order.id,
  });
});

// Verify Razorpay Payment
export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  // Find invoice by order ID
  const invoice = await Invoice.findOne({ razorpayOrderId: razorpay_order_id });

  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }

  // Verify the signature
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    throw new ApiError(400, "Invalid payment signature");
  }

  // Update invoice with payment details
  invoice.status = "Paid";
  invoice.razorpayPaymentId = razorpay_payment_id;
  invoice.razorpaySignature = razorpay_signature;
  await invoice.save();

  res.json({ message: "Payment verified successfully", invoice });
});
