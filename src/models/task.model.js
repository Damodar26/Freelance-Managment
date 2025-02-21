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
        type: Date,
        required: true
    },
    assignedTo: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' ,
        required: true
    },
    project: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Project' ,
        required: true
    },
}, 
{ 
    timestamps: true 
}
);

export const Task = mongoose.model('Task', TaskSchema);