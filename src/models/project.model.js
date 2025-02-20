import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"


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
{ 
    timestamps: true 
});


export const Project = mongoose.model('Project', ProjectSchema);