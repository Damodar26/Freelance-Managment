import mongoose, { Schema } from "mongoose";

const activityLogSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true // Optimized for querying logs by user
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
            index: true // Optimized for querying logs by project
        },
        task: {
            type: Schema.Types.ObjectId,
            ref: "Task",
            required: function () {
                return this.action.includes("Task"); // Required only for task-related actions
            },
            default: null,
            index: true // Optimized for querying logs by task
        },
        action: {
            type: String,
            enum: [
                "Created Project",
                "Updated Project",
                "Deleted Project",
                "Created Task",
                "Updated Task",
                "Deleted Task",
                "Marked Task as Complete",
                "Generated Invoice",
                "Updated Invoice",
                "Deleted Invoice",
                "Logged Time",
                "Updated Expense",
                "Deleted Expense",
                "Added Comment",
                "Deleted Comment"
            ],
            required: true
        },
        description: {
            type: String,
            trim: true, // Extra details about the action
            default: function () {
                return `${this.user} performed ${this.action} on ${this.project}`;
            }
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        ipAddress: {
            type: String
        },
        deviceInfo: {
            os: String,
            browser: String,
            device: String
        }
    },
    {
        timestamps: true
    }
);

// Indexes for optimized queries
activityLogSchema.index({ user: 1, project: 1, task: 1, action: 1 });

export const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
