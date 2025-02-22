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
    //get user details from frontend (through postman)
    //validation - not empty
    //check if user already exists : username, email
    //check for images, check for avatars
    //upload them to cloudinary, avatar
    //create user object - create entry in db
    //remove password and refersh token field from response
    //check for user creation 
    //return res

   const {fullName, email, username, password} = req.body
   //console.log("username:",username)

   if(
        [fullName, email, username, password].some((field) =>
            field?.trim()==="")
   ) {
        throw new ApiError(400, "All fields are required")
   }


   const existedUser = await User.findOne({
    $or: [{username}, {email}]
   })
   
   if(existedUser){
    throw new ApiError(409, "User with email or username already exists")
   }

   const avatarLocalPath = req.files?.avatar[0]?.path
   //const CoverImageLocalPath = req.files?.CoverImage[0]?.path

   let CoverImageLocalPath
   if (req.files && Array.isArray(req.files.CoverImage)&&req.files.CoverImage.length>0) {
        CoverImageLocalPath = req.files.CoverImage[0].path
    
   }

   if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
   }


  const avatar =  await uploadOnCloudinary(avatarLocalPath)
  const CoverImage =  await uploadOnCloudinary(CoverImageLocalPath)

  if(!avatar) {
    throw new ApiError(400, "Avatar is required")
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    CoverImage: CoverImage?.url || "",
    // CoverImage: CoverImage.url ,
    email,
    password,
    username: username.toLowerCase()
  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
)
  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering the user")
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully")
  )

})


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
    const { email, username, password } = req.body;

    if (!username && !email) {
        throw new ApiError(400, "Username or email is required");
    }

    // Find the user by email or username
    const user = await User.findOne({ $or: [{ username }, { email }] });

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    // Check if password is correct
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid User Credentials");
    }

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    otpStore.set(user.email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 }); // Store OTP for 5 mins

    // Send OTP via email
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Your Login OTP",
        text: `Dear ${user.username},\n\nYour OTP for login is ${otp}. It will expire in 5 minutes.\n\nBest regards,\nFreelancer Manager`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "OTP sent successfully. Please verify OTP to proceed.", email: user.email });
});

// 🔹 **Verify OTP & Complete Login**
export const verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        throw new ApiError(400, "Email and OTP are required");
    }

    const storedOTP = otpStore.get(email);

    if (!storedOTP || storedOTP.expiresAt < Date.now()) {
        throw new ApiError(400, "OTP expired or invalid");
    }

    if (storedOTP.otp !== otp) {
        throw new ApiError(400, "Invalid OTP");
    }

    // OTP is valid, remove it from store
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


export {
    registerUser,
    loginUser,
    logoutUser
}