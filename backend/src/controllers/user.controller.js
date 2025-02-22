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
    const { fullName, email, password, role } = req.body; // Added role
 
    if ([fullName, email, password, role].some((field) => field?.trim() === "")) {
         throw new ApiError(400, "All fields are required");
    }
 
    const existedUser = await User.findOne({ email });
 
    if (existedUser) {
         throw new ApiError(409, "User with email  already exists");
    }
 
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
 
   /* if (!avatarLocalPath) {
         throw new ApiError(400, "Avatar is required");
    }*/
 
    const avatar = req.files?.avatar?.[0]?.path 
        ? await uploadOnCloudinary(req.files.avatar[0].path) 
        : null;
    const coverImage = req.files?.CoverImage?.[0]?.path 
        ? await uploadOnCloudinary(req.files.CoverImage[0].path)
        : null;
 
    /*if (!avatar) {
         throw new ApiError(400, "Avatar upload failed");
    }*/
 
    const user = await User.create({
        fullName,
        avatar: avatar?.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        //username: username.toLowerCase(),
        role // Store role in the database
    });
 
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
 
    if (!createdUser) {
         throw new ApiError(500, "Something went wrong while registering the user");
    }
 
    return res.status(201).json(
         new ApiResponse(200, createdUser, "User registered successfully")
    );
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
    await sendOTP({ body: { email, isLogin: true } }, res);
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
    const { email, otp } = req.body;

    if (!email || !otp) {
        throw new ApiError(400, "Email and OTP are required");
    }

    const storedOTP = otpStore.get(email);

    console.log("Stored OTP:", storedOTP); // Debugging
    console.log("Received OTP:", otp);
    console.log("Current Time:", Date.now(), "Expiry Time:", storedOTP?.expiresAt);

    if (!storedOTP || storedOTP.expiresAt < Date.now()) {
        throw new ApiError(400, "OTP expired or invalid");
    }

    // Convert OTP to string to prevent type mismatch
    if (String(storedOTP.otp) !== String(otp)) {
        throw new ApiError(400, "Invalid OTP");
    }

    console.log("OTP Matched! Proceeding...");

    // OTP is valid, remove it from store AFTER verification
    otpStore.delete(email);

    // Retrieve user details
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Generate access & refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    // Exclude sensitive fields before sending response
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    // Set secure HTTP-only cookies
    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            message: "OTP verified successfully, login successful",
            user: loggedInUser,
            accessToken,
            refreshToken,
        });
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

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("http://localhost:8000/api/users/USER_ID");
      const data = await res.json();
      setUser(data);
    }
    fetchUser();
  }, []);

  return (
    <div>
      <h1>Welcome {user?.name}</h1>
      <p>Accolades: {user?.accolades}</p>
    </div>
  );
}


export {
    registerUser,
    loginUser,
    logoutUser
}