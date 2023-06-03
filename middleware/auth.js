import JWT from 'jsonwebtoken'
import { catchAsyncError } from './catchAsyncError.js'
import { User } from '../models/user.js'
import ErrorHandler from '../utils/errorHandler.js'


export const isAuthenticated = catchAsyncError(async (req, res, next) =>{
    const {token} = req.cookies

    if(!token) return next(new ErrorHandler("Please login or sign up", 404))

    //console.log(token)
    const user = JWT.verify(token, process.env.JWT_SECRET_KEY)
    //console.log(user)
    req.user = await User.findById(user._id)
    //console.log(req.user)
    next()
})