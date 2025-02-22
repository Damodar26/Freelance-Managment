import mongoose from "mongoose";

const TimeLogSchema = new mongoose.Schema(
  {
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    project: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Project", 
        required: true },
    task: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Task", required: true },
    startTime: { type: Date, 
        required: true },
    endTime: { 
        type: Date 
    },
    duration: { 
        type: Number 
    }, // Stored in minutes
    billable: { 
        type: Boolean, 
        default: true 
    },
    hourlyRate: { 
        type: Number 
    }, // Optional, for billable work
    earnings: { 
        type: Number 
    }, // Auto-calculated for billable hours
  },
  { timestamps: true }
);

export const TimeLog = mongoose.model("TimeLog", TimeLogSchema);
