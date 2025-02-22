import { Router } from "express";
import { 
    registerUser,
    verifyOTP, 
    sendOTP,
    loginUser, 
    logoutUser, 
    logWorkHours, 
    getUserProductivity,
    getUserById
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "CoverImage",
            maxCount: 1
        }
    ]),
    registerUser
);

router.route("/login").post(loginUser);
router.route("/verify-otp").post(verifyOTP);
router.route("/send-otp").post(sendOTP);
router.get("/:id", getUserById); 
// Secured routes
router.route("/logout").post(verifyJWT, logoutUser);

// Time tracking & productivity insights routes
router.route("/log-hours").post(verifyJWT, logWorkHours);  // Log work hours
router.route("/productivity-insights").get(verifyJWT, getUserProductivity);  // Fetch productivity data

export default router;
