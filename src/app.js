import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('./config/db'); // Database connection
const invoiceRoutes = require('src/routes/invoiceRoutes.js');
const errorHandler = require('./middleware/errorHandler');

dotenv.config(); // Load environment variables

// Middleware
app.use(express.json()); // Parse JSON requests

// Routes
app.use('/api/invoices', invoiceRoutes);

// Error handling middleware
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//Routes import

import userRouter from './routes/user.routes.js';

//Routes declaration

app.use("/api/v1/users", userRouter)

export {app}

