import mongoose, {Schema} from "mongoose";




const TaskSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String
     },
    status: { 
        type: String, 
        enum: ['To Do', 'In Progress', 'Done'], 
        default: 'To Do' 
    },
    priority: { 
        type: String, 
        enum: ['Low', 'Medium', 'High'], 
        default: 'Medium' 
    },
    dueDate: { 
        type: Date 
    },
    assignedTo: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    project: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Project' 
    },
}, 
{ 
    timestamps: true 
}
);

export const Task = mongoose.model('Task', TaskSchema);