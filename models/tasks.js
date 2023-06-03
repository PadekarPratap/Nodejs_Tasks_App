import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    description: {
        type: String,
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
    isPriority: {
        type: Boolean,
        default: false
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users', // taken from 'Users' collection
        required: true
    }
}, {timestamps: true})


export const Task = mongoose.model("Tasks", taskSchema)

