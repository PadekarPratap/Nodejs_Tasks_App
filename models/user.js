import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Name is required for registration"]
    },
    email:{
        type: String,
        required: [true, "email is required for registration"],
        unique: true
    },
    password:{
        type: String,
        required: [true, "Password is required for registration"],
        select: false
    }
}, {timestamps: true})


export const User = mongoose.model('Users', userSchema)