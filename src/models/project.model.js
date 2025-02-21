import mongoose, { Schema } from "mongoose";

const ProjectSchema = new Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String 
    },
    owner: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    members: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
      }
    ],
    tasks: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Task' 
      }
    ],
    deadline: { 
      type: Date 
    }, // Added deadline field for tracking project completion time
    activityLog: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ActivityLog'
      }
    ], // Tracks project-related activities (task creation, member additions)
    totalHoursWorked: { 
      type: Number, 
      default: 0 
    } // Tracks cumulative work hours on this project
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
