import express from "express";  
import { createPaymentOrder } from "../utils/paymentHelper.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/order", authMiddleware, createPaymentOrder);

export default router;
