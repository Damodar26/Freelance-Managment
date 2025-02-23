import mongoose, {Schema} from "mongoose";




const TaskSchema = new mongoose.Schema(
    {
      title: { 
        type: String, 
        required: true 
      },
      description: { 
        type: String
      },
      status: { 
        type: String, 
        enum: ['Pending', 'Done'], 
        default: 'Pending' 
      },
      priority: { 
        type: String, 
        enum: ['Low', 'Medium', 'High'], 
        default: 'Medium' 
      },
      dueDate: { 
        type: Date
      }, // Made dueDate optional
      assignedTo: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
      },
      project: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Project',
        required: true
      },
      workHoursLogged: { 
        type: Number, 
        default: 0 
      }, // Tracks time spent on task
      activityLog: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'ActivityLog'
        }
      ] // Logs task-related updates
    },
    { timestamps: true }
  );
  

export const Task = mongoose.model('Task', TaskSchema);