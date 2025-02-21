import express from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { generateInvoice } from '../utils/invoiceGenerator.js'; // Assuming you have a utility to generate invoices

const router = express.Router();

router.post('/generate-invoice', async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        const invoice = await generateInvoice(user);

        res.status(200).json({ success: true, invoice });
    } catch (error) {
        next(new ApiError(401, error?.message || "Invalid access token"));
    }
});

export default router;