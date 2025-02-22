import mongoose, { Schema } from "mongoose";

const ProjectSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    deadline: { type: Date }, // Tracks project completion time
    activityLog: [{ type: mongoose.Schema.Types.ObjectId, ref: "ActivityLog" }], // Project activity tracking
    totalHoursWorked: { type: Number, default: 0 }, // Cumulative work hours

    // New field: Project status (required for frontend)
    status: {
      type: String,
      enum: ["active", "completed", "archived"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Ensure owner is automatically added to members before saving
ProjectSchema.pre("save", function (next) {
  if (!this.members.includes(this.owner)) {
    this.members.push(this.owner);
  }
  next();
});

export const Project = mongoose.model("Project", ProjectSchema);
