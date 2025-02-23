import {asyncHandler} from "../utils/asyncHandlers.js"
import {ApiError} from  "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from  "../utils/ApiResponse.js"
import {ActivityLog} from "../models/activity.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

/*const generateAccessAndRefreshTokens = async(userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken
    const refreshToken = user.generateRefreshToken

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})

    return {accessToken, refreshToken}

    if(!user) {
      throw new ApiError(404, "user does not exist")
    }
  
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating refresh and access token")
  }
}
*/
const  generateAccessAndRefreshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        console.log("Fetched User:", user);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password, role } = req.body;

    if ([fullName, email, password, role].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({ email });
    if (existedUser) {
        throw new ApiError(409, "User with email already exists");
    }

    // Validate role
    const validRoles = ["freelancer", "client"];
    if (!validRoles.includes(role)) {
        throw new ApiError(400, "Invalid role selected");
    }

    let avatar = null;
    let coverImage = null;

    if (req.files?.avatar?.[0]?.path) {
        const uploadedAvatar = await uploadOnCloudinary(req.files.avatar[0].path);
        if (!uploadedAvatar?.url) {
            throw new ApiError(500, "Avatar upload failed");
        }
        avatar = uploadedAvatar.url;
    }

    if (req.files?.CoverImage?.[0]?.path) {
        const uploadedCover = await uploadOnCloudinary(req.files.CoverImage[0].path);
        if (!uploadedCover?.url) {
            throw new ApiError(500, "Cover image upload failed");
        }
        coverImage = uploadedCover.url;
    }

    const user = await User.create({
        username: undefined,
        fullName,
        avatar,
        coverImage,
        email,
        password,
        role
    });

    const createdUser = await User.findById(user._id).select("-password -email");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"));
});

 

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Store OTPs in memory (consider using a database for production)
const otpStore = new Map();

// 🔹 **Login User & Send OTP**
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    // Find the user by email or username
    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    // Check if password is correct
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid User Credentials");
    }

    // Generate a 6-digit OTP
    //await sendOTP({ body: { email, isLogin: true } }, res);
});

export const sendOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    // Check if the user exists (for login) or ensure the email is new (for registration)
    const user = await User.findOne({ email });

    if (!user && req.body.isLogin) {
        throw new ApiError(404, "User not found");
    }

    if (user && !req.body.isLogin) {
        throw new ApiError(409, "User already exists");
    }

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });
    // Send OTP via email
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "OTP sent successfully", email });
});


// 🔹 **Verify OTP & Complete Login**
export const verifyOTP = asyncHandler(async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ error: "Email and OTP are required" });
        }

        const storedOTP = otpStore.get(email);
        if (!storedOTP || storedOTP.expiresAt < Date.now()) {
            return res.status(400).json({ error: "OTP expired or invalid" });
        }

        if (String(storedOTP.otp) !== String(otp)) {
            return res.status(400).json({ error: "Invalid OTP" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        otpStore.delete(email);
        return res.status(200).json({
            message: "OTP verified successfully",
            user: loggedInUser,
            accessToken,
            refreshToken,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});




/*const logoutUser = asyncHandler(async(req, res) => {
 await  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined
      }
    },
    {
      new: true
    }
  )


  const options = {
    httpOnly: true,
    secure: true
  }
  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(new ApiResponse(200, {}, "User logged Out"))

})*/
const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

//const User = require("../models/user.model");

// Log Work Hours (Manual Entry)
export const logWorkHours = async (req, res) => {
    try {
        const { userId, projectId, taskId, startTime, endTime, billable } = req.body;

        if (!userId || !projectId || !startTime || !endTime) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const duration = (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60); // Convert to hours

        const log = new ActivityLog({
            user: userId,
            project: projectId,
            task: taskId || null,
            action: "Logged Time",
            description: `Logged ${duration.toFixed(2)} hours (${billable ? "Billable" : "Non-billable"})`,
            timestamp: new Date(),
        });

        await log.save();
        res.status(201).json({ message: "Work hours logged successfully", log });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get User Productivity Trends
export const getUserProductivity = async (req, res) => {
    try {
        const { userId } = req.params;
        const logs = await ActivityLog.find({ user: userId, action: "Logged Time" });

        let totalHours = 0;
        let billableHours = 0;

        logs.forEach(log => {
            const match = log.description.match(/(\d+(\.\d+)?) hours/);
            if (match) {
                const hours = parseFloat(match[1]);
                totalHours += hours;
                if (log.description.includes("Billable")) billableHours += hours;
            }
        });

        res.status(200).json({ totalHours, billableHours });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

export const getUserById = async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
//import { useEffect, useState } from "react";


export {
    registerUser,
    loginUser,
    logoutUser
}