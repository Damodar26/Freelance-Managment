import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: false,
            lowercase: true,
            trim: true, 
            index: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true, 
        },
        fullName: {
            type: String,
            required: true,
            unique: true,
            trim: true, 
            index: true
        },
        role: {
            type: String,
            enum: ["freelancer", "client"],
            default: "freelancer"
        },
        avatar: {
            type: String, // Cloudinary URL
            required: false,
        },
        coverImage: {
            type: String, // Cloudinary URL
        },
        projectHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Project"
            }
        ],
        activityHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "ActivityLog"
            }
        ],
        totalHoursWorked: { 
            type: Number, 
            default: 0 
        },
        billableHours: { 
            type: Number, 
            default: 0 
        },

        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare passwords
userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// Generate Access Token
userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
};

// Generate Refresh Token
userSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};

export const User = mongoose.model("User", userSchema);
