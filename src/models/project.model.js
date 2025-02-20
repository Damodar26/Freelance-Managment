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
